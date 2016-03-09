/**
 * game.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// Game constants
	var ATTACK_RADIUS_SQUARED = 60*60;
	var ATTACK_TIME = 20; // Attack period, lower value - faster attacking
	var BULLET_DAMAGE = 40;
	var BULLET_SPEED = 200;
	var GRID_SIZE = 40;
	var GROWTH_TIME = 200; // Growth period, lower value - faster bac growth
	var MAX_Y = 510;
	var MOVE_SPEED = 180;
	var PLAYER_MAX_HEALTH = 100;
	var REGEN_AMOUNT = 5; // Regen amount, how much you regen per tick
	var REGEN_TIME = 50; // Regen period, lower value - faster regen
	var SHOOT_TIME = 180; // Shooting period, lower value - faster shooting
	var SPAWN_RATE = 0.3;
	var SCORE_TICK_TIME = 100; // Score tick time, lower value, faster uptick score

	// Game variables
	var player;

	var bacteriaGrid;			// A 2D array to store bacteria positions
	var bacteriaGroups = [];	// The list of bacteria groups
	var enemyBullets;			// The group of enemy bullets
	var firingCounter = 0;		// Counter determining when bacteria can fire
	var growthCounter = 0;		// Counter to determine when bacteria grow
	var regenCounter = 0;		// Counter for regen
	var shrinkCounter = 0;		// Counter for re-shrinking
	var attackCounter = 40;		// Counter for attacking
	var scoreCounter = 0;
	var gameEndTimer = 0;

	//var gameWon = false;
	var gameLost;

	var cursors;
	var keys;

	var health;
	var healthbar;
	var score = 0;
	var scoreText = "";

	var bloop;

	// Phaser functions
	var Game = window.Game = {

		preload: function() {
			// Load all the needed resources for the menu.
			GameInstance.load.image('background', './assets/background_on.png');
			GameInstance.load.spritesheet('player', 'assets/agentcell.png', 33, 32);
			GameInstance.load.spritesheet('bacteria1', 'assets/bac1_on.png', 33, 33);
			GameInstance.load.spritesheet('bacteria2', 'assets/bac2.png', 40, 40);
			GameInstance.load.spritesheet('bacteria3', 'assets/bac3.png', 33, 33);
			GameInstance.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
			GameInstance.load.image('bullet1Small', 'assets/bac1bullet.png');
			//GameInstance.load.image('enemyBullet2', 'assets/bullet1.png');
			GameInstance.load.image('health_border', 'assets/health_border.png');
			GameInstance.load.image('health_red', 'assets/health_red.png');
			GameInstance.load.image('menuButton', './assets/menuLogo.png');
			GameInstance.load.audio('bloop', 'assets/bloop.wav');
		},

		create: function() {
			// Initialize the physics system
			GameInstance.physics.startSystem(Phaser.Physics.ARCADE);

			// The player and its settings
			Game.add.sprite(0, 0, "background");
			player = GameInstance.add.sprite(0, 0, 'player');
			player.animations.add('attack', [1]);
			player.animations.add('default', [0]);
			player.anchor.setTo(0.5, 0.5);
			GameInstance.physics.arcade.enable(player, Phaser.Physics.ARCADE);
			player.body.collideWorldBounds = true;

			// Enemy bullets
			enemyBullets = GameInstance.add.group();
			enemyBullets.enableBody = true;
			enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
			enemyBullets.createMultiple(3000, 'bullet1Small');
			enemyBullets.setAll('anchor.x', 0.5);
			enemyBullets.setAll('anchor.y', 0.5);
			enemyBullets.setAll('scale.x', 0.5);
			enemyBullets.setAll('scale.y', 0.5);
			enemyBullets.setAll('outOfBoundsKill', true);
			enemyBullets.setAll('checkWorldBounds', true);

			// Create 3 groups for the bacteria strains
			bacteriaGroups.push(GameInstance.add.physicsGroup());
			bacteriaGroups.push(GameInstance.add.physicsGroup());
			bacteriaGroups.push(GameInstance.add.physicsGroup());
			
			// Initialize health
			health = PLAYER_MAX_HEALTH;
			healthBorder = GameInstance.add.sprite(15, GameInstance.world.height - 15 , 'health_border');
			healthbar = GameInstance.add.sprite(15 + 3, GameInstance.world.height - 15 - 3, 'health_red');
			healthbar.anchor.setTo(0, 1);
			healthBorder.anchor.setTo(0, 1);

			// Score text
			scoreText = GameInstance.add.text(300, 560, 'Score: 0', { font: '30px Arial', fill: '#fff' });
			scoreText.anchor.setTo(0, 0.5);

			// Audio
			bloop = GameInstance.add.audio('bloop');

			gameLost = false;

			//Adding menu button
			menuButton = Game.add.button(WIDTH , HEIGHT, 'menuButton', Game.startMenu, Game);
			menuButton.anchor.x = 1.0;
			menuButton.anchor.y = 1.0;

			// Keyboard controls
			cursors = GameInstance.input.keyboard.createCursorKeys();
			keys = GameInstance.input.keyboard.addKeys({
				'w': Phaser.Keyboard.W,
				'a': Phaser.Keyboard.A,
				's': Phaser.Keyboard.S,
				'd': Phaser.Keyboard.D,
				'attack': Phaser.Keyboard.SPACEBAR
			});

			Game.loadLevel(0);

		},

		update: function() {
			// Handle bacteria growth
			growthCounter++;
			if (growthCounter > GROWTH_TIME) {
				Game.growBacteria(0);
				Game.growBacteria(1);
				Game.growBacteria(2);
				growthCounter = 0;
			}
		
			// Handle bullet destroy
			enemyBullets.forEach(function(d) {
				if (d.y > 520){
					d.kill();
				}
			});

			// Handle firing counters
			for (var i=0; i < bacteriaGroups.length; i++) {
				bacteriaGroups[i].forEach(function(d){
					d.counter++;
					if (d.counter === SHOOT_TIME-100){
						d.animations.add('shooting');
						d.animations.play('shooting', 6, false);
					}
					if (d.counter === SHOOT_TIME){
						d.counter = 0;
						d.frame = 0;
						//Game.fourWay(d);
						Game.playerChaser(d);
						bloop.play();
					}
				});
			}

			// Healthbar animator
			if (health < PLAYER_MAX_HEALTH) {
				regenCounter++;
				if (regenCounter >= REGEN_TIME) {
					regenCounter = 0;
					health += REGEN_AMOUNT;
				}
			} else {
				regenCounter = 0;
			}

			if (health > 0){
				healthbar.scale.setTo(health/PLAYER_MAX_HEALTH, 1);
			}

			// Reshrinking animator
			shrinkCounter++;
			if (shrinkCounter >= 4){
				player.scale.setTo(1,1);
				player.animations.play('default');
			}

			// Score increase logic
			scoreCounter++;
			if (scoreCounter >= SCORE_TICK_TIME){
				score += 10;
				scoreText.text = "Score: "+score;
				scoreCounter = 0;
			}

			// Can you attack?
			attackCounter++;

			// Physics checkers
			for(var i=0; i < bacteriaGroups.length; i++) {
				GameInstance.physics.arcade.collide(player, bacteriaGroups[i]);
			}
			GameInstance.physics.arcade.overlap(enemyBullets, player, Game.enemyHitsPlayer, null, Game);

			//  Reset the player's velocity
			player.body.velocity.x = 0;
			player.body.velocity.y = 0;

			// Handle movement & attacking
			if (cursors.left.isDown || keys.a.isDown) {
				// Move to the left
				player.body.velocity.x = -MOVE_SPEED;
			}
			if (cursors.right.isDown || keys.d.isDown) {
				// Move to the right
				player.body.velocity.x = MOVE_SPEED;
			}
			if (cursors.up.isDown || keys.w.isDown) {
				// Move up
				player.body.velocity.y = -MOVE_SPEED;
			}
			if (cursors.down.isDown || keys.s.isDown) {
				// Move down
				player.body.velocity.y = MOVE_SPEED;
			}
			if (keys.attack.isDown && attackCounter > ATTACK_TIME) {
				Game.attack();
				player.animations.play('attack');
			}

			/*//checks you win the level
			if (bacteria.countLiving()===0)
				gameWon = true;
			if (gameWon){
				gameEndTimer++;
				if(gameEndTimer >= 50)
					GameInstance.state.start('LevelPassed');
			}*/

			if (gameLost){
				gameEndTimer++;
				if(gameEndTimer >= 50)
					GameInstance.state.start('GameOver');
			}
		},

		loadLevel: function(num) {
			// implement Game
			if (num >= window.Levels.length) {
				// tried to load a level past the final level
				// game complete
			} else {
				var level = window.Levels[num];
				// Initialize the player
				player.visible = true;
				player.x = level.playerStart.x * GRID_SIZE;
				player.y = level.playerStart.y * GRID_SIZE;
				// Spawn the initial bacteria
				Game.removeAllBacteria();
				Game.clearBacteriaGrid();
				for (var i=0; i < level.bacteria.length; i++) {
					var bac = level.bacteria[i];
					Game.spawnBacteria(bac.strain, bac.x, bac.y);
				}


			}
		},

		growBacteria: function(strainNum) {
			var neighborhood = [
				{x: 1, y: 0},
				{x: -1, y: 0},
				{x: 0, y: 1},
				{x: 0, y: -1}
			];
			var perimeter = [];
			// Get the grid positions along the perimeter of the current bacteria
			for (var i=0; i < bacteriaGroups[strainNum].length; i++) {
				var bac = bacteriaGroups[strainNum].getAt(i);
				var gridX = Math.floor(bac.x / GRID_SIZE);
				var gridY = Math.floor(bac.y / GRID_SIZE);
				for (var j=0; j < neighborhood.length; j++) {
					var neighborX = gridX + neighborhood[j].x;
					var neighborY = gridY + neighborhood[j].y;
					if (Game.inGameBounds(neighborX, neighborY) && !Game.bacteriaAt(neighborX, neighborY)
						&& !Game.containsPosition(perimeter, neighborX, neighborY)) {
						perimeter.push({x: neighborX, y: neighborY});
					}
				}
			}
			// Spawn bacteria along the perimeter
			for (var i=0; i < perimeter.length; i++) {
				if (Math.random() < SPAWN_RATE) {
					Game.spawnBacteria(strainNum, perimeter[i].x, perimeter[i].y);
				}
			}
		},

		removeAllBacteria: function() {
			for (var i=0; i < bacteriaGroups.length; i++) {
				bacteriaGroups[i].removeAll(true);
			}
		},

		// Checks if a position is already included in a list
		containsPosition: function(posList, x, y) {
			for (var i=0; i < posList.length; i++) {
				if (posList[i].x === x && posList[i].y === y) {
					return true;
				}
			}
			return false;
		},

		bacteriaAt: function(gridX, gridY) {
			return !!bacteriaGrid[gridX][gridY];
		},

		// Checks if a 2D position is within game bounds
		inGameBounds: function(x, y) {
			return (x > 0 && x < Math.floor(WIDTH/GRID_SIZE)
					&& y > 0 && y < Math.floor(MAX_Y/GRID_SIZE)+1);
		},

		// Clears the bacteria grid
		clearBacteriaGrid: function() {
			bacteriaGrid = [];
			for (var i=0; i < Math.floor(WIDTH/GRID_SIZE); i++) {
				col = [];
				for (var j=0; j < Math.floor(HEIGHT/GRID_SIZE); j++) {
					col.push(false);
				}
				bacteriaGrid.push(col);
			}
		},

		// Spawns a bacteria in a given grid position
		spawnBacteria: function(strainNum, x, y) {
			if (strainNum < 0 || strainNum > 2) {
				// Not a valid strain, do nothing
				return;
			}
			var playerGridX = Math.floor(player.x / GRID_SIZE);
			var playerGridY = Math.floor(player.y / GRID_SIZE);
			// Don't spawn if player is there
			if (playerGridX === x && playerGridY === y) {
				return;
			}
			var spriteName;
			if (strainNum === 0) {
				spriteName = 'bacteria1';
			} else if (strainNum === 1) {
				spriteName = 'bacteria2';
			} else if (strainNum === 2) {
				spriteName = 'bacteria3';
			}
			var newBacteria = bacteriaGroups[strainNum].create(x*GRID_SIZE, y*GRID_SIZE, spriteName);
			newBacteria.anchor.setTo(0.5, 0.5);
			newBacteria.body.immovable = true;
			newBacteria.counter = 0;
			bacteriaGrid[x][y] = true;
		},

		// Kill a bacteria
		killBacteria: function(bac) {
			var gridX = Math.floor(bac.x / GRID_SIZE);
			var gridY = Math.floor(bac.y / GRID_SIZE);
			bacteriaGrid[gridX][gridY] = false;
			bac.destroy();
		},

		// Makes the player attack
		attack: function() {
			player.scale.setTo(1.5, 1.5);
			shrinkCounter = 0;
			attackCounter = 0;
			for (var i=0; i < bacteriaGroups.length; i++) {
				bacteriaGroups[i].forEach(function(bac) {
					var dx = bac.x - player.x;
					var dy = bac.y - player.y;
					if (dx*dx + dy*dy < ATTACK_RADIUS_SQUARED) {
						Game.killBacteria(bac);
					}
				});
			}
		},

		// The diagonal cross shooting pattern
		fourWay: function(bacterium) {
			Game.enemyFires(bacterium, 45);
			Game.enemyFires(bacterium, 135);
			Game.enemyFires(bacterium, 225);
			Game.enemyFires(bacterium, 315);
		},

		enemyFires: function(bacterium, angle) {
			// Grab the first bullet we can from the pool
			bulletInstance = enemyBullets.getFirstExists(false);
		
			// This group fires
			bulletInstance.reset(bacterium.body.x+20, bacterium.body.y+20);

			//GameInstance.physics.arcade.moveToObject(bulletInstance,player,120);
			GameInstance.physics.arcade.velocityFromAngle(angle, BULLET_SPEED, bulletInstance.body.velocity);
		},

		// Fires 1 bullet that chases player 
		playerChaser: function(bacterium) {
			bulletInstance = enemyBullets.getFirstExists(false);
			bulletInstance.reset(bacterium.body.x+20, bacterium.body.y+20);
			GameInstance.physics.arcade.moveToObject(bulletInstance,player,BULLET_SPEED);
		},

		enemyHitsPlayer: function(player, bullet) {	
			bullet.kill();
			health -= BULLET_DAMAGE;

			if (health <= 0) {	
				//healthbar.loadTexture('health_0');
				
				//  And create an explosion :)
				healthbar.scale.setTo(0,1);

				player.loadTexture('kaboom');
				var boom = player.animations.add('boom');
				player.animations.play('boom', 100, false, true);
				enemyBullets.callAll('kill');

				gameLost = true;
				//GameInstance.state.start('GameOver');
			}
		},

		startMenu: function () {
			// Change the state to the actual game.
			Game.state.start('Menu');
		}
	};

})();
