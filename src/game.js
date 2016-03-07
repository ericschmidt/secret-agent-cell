// GAME CONSTANTS
	var ATTACK_RADIUS_SQUARED = 60*60;
	var GRID_SIZE = 40;
	var GROWTH_TIME = 200;
	var MOVE_SPEED = 150;
	var SHOOT_TIME = 160;
	var SPAWN_RATE = 0.3;
	var BULLET_SPEED = 100;

// GAME VARIABLES
	var player;

	var bacteriaGrid; // A 2D array to store bacteria positions
	var bacteria; // The group of bacteria
	var enemyBullets; // The group of enemy bullets
	var firingCounter = 0; // int holding when the bac can fire
	var growthCounter = 0; // Counter to determine when bacteria grow

	var cursors;
	var keys;

	var health = 3;
	var healthbar;
	var stateText;
	
	var playing;

var Game = {

	preload : function() {
        // Load all the needed resources for the menu.
        game.load.image('background', './assets/background.png');
        game.load.image('player', 'assets/agentcell.png');
		game.load.spritesheet('bacteria', 'assets/bac1.png', 33, 33);
		game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
		game.load.image('enemyBullet', 'assets/bullet7.png');
		game.load.spritesheet('health_32', 'assets/health32.png', 180, 40);
		game.load.spritesheet('health_21', 'assets/health21.png', 180, 40);
		game.load.image('health_0', 'assets/health_0.png');
 		game.load.audio('bloop', 'assets/bloop.wav');
    },

    create: function () {

        // Add menu screen.
        game.physics.startSystem(Phaser.Physics.ARCADE);

		// The player and its settings
		this.add.sprite(0, 0, "background");
		player = game.add.sprite(32, game.world.height - 150, 'player');
		player.anchor.setTo(0.5,0.5);
		game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;

		// Enemy bullets
		enemyBullets = game.add.group();
		enemyBullets.enableBody = true;
		enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
		enemyBullets.createMultiple(3000, 'enemyBullet');
		enemyBullets.setAll('anchor.x', 0.5);
		enemyBullets.setAll('anchor.y', 1);
		enemyBullets.setAll('outOfBoundsKill', true);
		enemyBullets.setAll('checkWorldBounds', true);

		// Create a group for the bacteria
		bacteria = game.add.group();
		
		bacteria.enableBody = true;
		bacteria.physicsBodyType = Phaser.Physics.ARCADE;
		
		// Initialize health
		health = 3;
		healthbar = game.add.sprite(32, game.world.height - 75, 'health_32');

		//State text - invisible
		stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
		stateText.anchor.setTo(0.5, 0.5);
		stateText.visible = false;

		// Audio
 		bloop = game.add.audio('bloop');

		// Keyboard controls
		cursors = game.input.keyboard.createCursorKeys();
		keys = game.input.keyboard.addKeys({
			'w': Phaser.Keyboard.W,
			'a': Phaser.Keyboard.A,
			's': Phaser.Keyboard.S,
			'd': Phaser.Keyboard.D,
			'attack': Phaser.Keyboard.SPACEBAR
		});

		this.loadLevel(0);

    },

    update: function () {
    	game.physics.arcade.collide(player, bacteria);

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
		if (keys.attack.isDown) {
			this.attack();
		}

		// Handle bacteria growth
		growthCounter++;
		if (growthCounter > GROWTH_TIME) {
			this.growBacteria();
			growthCounter = 0;
		}
		
		// Handle firing counters
		bacteria.forEach(function(d){
			d.counter++;
			if (d.counter === SHOOT_TIME-100){
				d.animations.add('shooting');
				d.animations.play('shooting', 6, false);
			}
			if (d.counter === SHOOT_TIME){
				d.counter = 0;
				d.frame = 0;
				Game.fourWay(d);
				bloop.play();
			}
		});


		game.physics.arcade.overlap(enemyBullets, player, this.enemyHitsPlayer, null, this);
        

    },

    loadLevel: function (num) {

        playing = true;
		// implement this
		if (num >= window._levels.length) {
			// tried to load a level past the final level
			// game complete
		} else {
			var level = window._levels[num];
			// Initialize the player
			player.visible = true;
			player.x = level.playerStart.x * GRID_SIZE;
			player.y = level.playerStart.y * GRID_SIZE;
			// Spawn the initial bacteria
			bacteria.removeAll(true);
			this.clearBacteriaGrid();
			for (var i=0; i < level.bacteriaStarts.length; i++) {
				var pos = level.bacteriaStarts[i];
				this.spawnBacteria(pos.x, pos.y);
			}
		}

    },

    destroyBacteria: function (bac) {

        bac.anchor.x = 0.5;
		bac.anchor.y = 0.5;
		bac.animations.add('kaboom');

    },



    growBacteria: function () {

        		var neighborhood = [
			{x: 1, y: 0},
			{x: -1, y: 0},
			{x: 0, y: 1},
			{x: 0, y: -1}
		];
		var perimeter = [];
		// Get the grid positions along the perimeter of the current bacteria
		for (var i=0; i < bacteria.length; i++) {
			var bac = bacteria.getAt(i);
			var gridX = Math.floor(bac.x / GRID_SIZE);
			var gridY = Math.floor(bac.y / GRID_SIZE);
			for (var j=0; j < neighborhood.length; j++) {
				var neighborX = gridX + neighborhood[j].x;
				var neighborY = gridY + neighborhood[j].y;
				if (this.inGridBounds(neighborX, neighborY) && !this.bacteriaAt(neighborX, neighborY)
					&& !this.containsPosition(perimeter, neighborX, neighborY)) {
					perimeter.push({x: neighborX, y: neighborY});
				}
			}
		}
		// Spawn bacteria along the perimeter
		for (var i=0; i < perimeter.length; i++) {
			if (Math.random() < SPAWN_RATE) {
				this.spawnBacteria(perimeter[i].x, perimeter[i].y);
			}
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

	// Checks if a 2D position is within grid bounds
	inGridBounds: function(x, y) {
		return (x >= 0 && x < Math.floor(WIDTH/GRID_SIZE)
				&& y >= 0 && y < Math.floor(HEIGHT/GRID_SIZE));
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
	spawnBacteria: function(x, y) {
		var playerGridX = Math.floor(player.x / GRID_SIZE);
		var playerGridY = Math.floor(player.y / GRID_SIZE);
		// Don't spawn if player is there
		if (playerGridX === x && playerGridY === y) {
			return;
		}
		var newBacteria = bacteria.create(x*GRID_SIZE, y*GRID_SIZE, 'bacteria');
		newBacteria.body.immovable = true;
		newBacteria.counter = 0;
		bacteriaGrid[x][y] = true;
	},

	// Makes the player attack
	attack: function() {
		bacteria.forEach(function(bac) {
			var dx = bac.x - player.x;
			var dy = bac.y - player.y;
			if (dx*dx + dy*dy < ATTACK_RADIUS_SQUARED) {
				bac.destroy();
			}
		});
	},

	fourWay: function(bacterium){

		this.enemyFires(bacterium, 45);
		this.enemyFires(bacterium, 135);
		this.enemyFires(bacterium, 225);
		this.enemyFires(bacterium, 315);
	},

	enemyFires: function (bacterium, angle) {

		//  Grab the first bullet we can from the pool
		enemyBullet = enemyBullets.getFirstExists(false);
	
		//This group fires
		enemyBullet.reset(bacterium.body.x+20, bacterium.body.y+20);

		//game.physics.arcade.moveToObject(enemyBullet,player,120);
		game.physics.arcade.velocityFromAngle(angle, BULLET_SPEED, enemyBullet.body.velocity);
	},


	enemyHitsPlayer: function (player,bullet) {
	
	bullet.kill();
	health--;
		if(health==0)
		{	
			healthbar.loadTexture('health_0');
			
			//  And create an explosion :)
			player.loadTexture('kaboom');
			var boom = player.animations.add('boom');
			player.animations.play('boom', 100, false);
			playing = false;
			enemyBullets.callAll('kill');

			stateText.text="GAME OVER";
			stateText.visible = true;
		}
		else if(health==1) 
		{
			//healthbar = game.add.sprite(32, game.world.height - 75, 'health_21');
			healthbar.loadTexture('health_21');
			var drop = healthbar.animations.add('drop');
			healthbar.animations.play('drop', 30, false);
		}
		else if(health==2)  
		{
			var drop = healthbar.animations.add('drop');
			healthbar.animations.play('drop', 30, false);
		}
		else    console.log("EXCEPTION: health != 0||1||2||3");
	},

	

};