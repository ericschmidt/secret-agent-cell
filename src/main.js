/**
 * main.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// CONSTANTS
	var GRID_SIZE = 50;
	var MOVE_SPEED = 150;

	// GAME VARIABLES
	var player;

	var bacteria;
	var enemyBullets; //The group of enemy bullets
	var enemyBullet; //The individual bullet
	var firingTimer = 0; //int holding when the bac can fire
	var bulletSpeed = 150;
	
	var explosions;

	var cursors;
	var keys;
	
	var playing;

	// The Phaser game instance
	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	// HELPER FUNCTIONS

	// Loads and displays a level to play from a given index
	function loadLevel(num) {
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
		}
	}

	// Tears down the current level
	function unloadLevel() {
		playing = false;
		// implement this
	}

	// Displays the main menu
	function displayMainMenu() {
		playing = false;
		// implement this - should show a play button at least
	}

	// Displays the game over screen
	function displayGameOver() {
		playing = false;
		// implement this - should somehow lead back to main menu
	}

	// MAIN PHASER FUNCTIONS

	// Preload assets
	function preload() {
		game.load.image('player', 'assets/star.png');
    	game.load.spritesheet('bacteria', 'assets/baddie.png', 32, 32);
    	game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    	game.load.image('enemyBullet', 'assets/bullet7.png');
	}

	// Initialize game
	function create() {
		// Enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// The player and its settings
    	player = game.add.sprite(32, game.world.height - 150, 'player');
    	player.anchor.setTo(0.5,0.5);
    	game.physics.arcade.enable(player, Phaser.Physics.ARCADE);
    	player.body.collideWorldBounds = true;

    	//Enemy bullets
    	enemyBullets = game.add.group();
    	enemyBullets.enableBody = true;
    	enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    	enemyBullets.createMultiple(30, 'enemyBullet');
    	enemyBullets.setAll('anchor.x', 0.5);
    	enemyBullets.setAll('anchor.y', 1);
    	enemyBullets.setAll('outOfBoundsKill', true);
    	enemyBullets.setAll('checkWorldBounds', true);

		// Create a group for the bacteria
		bacteria = game.add.group();
    	bacteria.enableBody = true;
    	bacteria.physicsBodyType = Phaser.Physics.ARCADE;
    	
    	// Create the groups
    	//createBacteria();
    	group1 = bacteria.create(60, 60, 'bacteria');
    	group1.anchor.setTo(0.5,0.5);
    	group2 = bacteria.create(600, 300, 'bacteria');
    	//  Cannot move through bacteria
    	group1.body.immovable = true;
    	group2.body.immovable = true;

    	// Explosion pool
    	explosions = game.add.group();
    	explosions.createMultiple(30, 'kaboom');
    	//explosions.forEach(destroyBacteria, this);

    	//State text - invisible
    	stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    	stateText.anchor.setTo(0.5, 0.5);
    	stateText.visible = false;

		// Keyboard controls
		cursors = game.input.keyboard.createCursorKeys();
		keys = game.input.keyboard.addKeys({
			'w': Phaser.Keyboard.W,
			'a': Phaser.Keyboard.A,
			's': Phaser.Keyboard.S,
			'd': Phaser.Keyboard.D,
			'attack': Phaser.Keyboard.SPACEBAR
		});

		// Display main menu
		displayMainMenu();
	}

	// The main game loop
	function update() {
		// Do nothing if not playing a level
		//if (!playing) return;

		//  Collide the player with bacteria
		game.physics.arcade.collide(player, bacteria);

		//  Reset the player's velocity
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;

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

		//Bac fires
		if (game.time.now > firingTimer)
        {
            fourWay();
        }

        game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
	}

	//Destroy bacteria
	function destroyBacteria (bac) {

    	bac.anchor.x = 0.5;
    	bac.anchor.y = 0.5;
    	bac.animations.add('kaboom');
	}

	function fourWay(){
    	enemyFires(45);
    	enemyFires(135);
    	enemyFires(225);
    	enemyFires(315);
	}

	function enemyFires (angle) {

    	//  Grab the first bullet we can from the pool
    	enemyBullet = enemyBullets.getFirstExists(false);
    
    	//This group fires
    	enemyBullet.reset(group1.body.x+20, group1.body.y+20);

    	//game.physics.arcade.moveToObject(enemyBullet,player,120);
    	game.physics.arcade.velocityFromAngle(angle, bulletSpeed, enemyBullet.body.velocity);
    	firingTimer = game.time.now + 1500;
	}


	function enemyHitsPlayer (player,bullet) {
    
    	bullet.kill();

    	//  And create an explosion :)
    	var explosion = explosions.getFirstExists(false);
    	explosion.reset(player.body.x, player.body.y);
    	explosion.play('kaboom', 30, false, true);

    	player.kill();
    	enemyBullets.callAll('kill');
    	playing = false;

    	stateText.text="GAME OVER";
    	stateText.visible = true;
	}
})();

