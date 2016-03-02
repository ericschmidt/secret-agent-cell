/**
 * main.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// CONSTANTS
	var MOVE_SPEED = 150;

	// GAME VARIABLES
	var player;
	var bacteria;
	var cursors;
	var keys;
	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	// HELPER FUNCTIONS

	function collectStar (player, star) {
		
		// Removes the star from the screen
		star.kill();

	}

	// Loads and displays a level to play
	function loadLevel(num) {
		// stuff
	}

	// MAIN PHASER FUNCTIONS

	// Preload assets
	function preload() {

		//game.load.image('sky', 'assets/sky.png');
		//game.load.image('ground', 'assets/platform.png');
		game.load.image('player', 'assets/star.png');
		//game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
		game.load.spritesheet('bacteria', 'assets/baddie.png', 32, 32);

	}

	// Initialize game
	function create() {
		// Enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//  A simple background for our game
		//game.add.sprite(0, 0, 'sky');

		// Create a group for the bacteria
		bacteria = game.add.physicsGroup();

		// The player and its settings
		player = game.add.sprite(32, game.world.height - 150, 'player');
		game.physics.arcade.enable(player);

		// Player physics properties. Give the little guy a slight bounce
		player.body.collideWorldBounds = true;

		// Keyboard controls
		cursors = game.input.keyboard.createCursorKeys();
		console.log(game.input.keyboard);
		keys = game.input.keyboard.addKeys({
			'w': Phaser.Keyboard.W,
			'a': Phaser.Keyboard.A,
			's': Phaser.Keyboard.S,
			'd': Phaser.Keyboard.D,
			'attack': Phaser.Keyboard.SPACEBAR
		});
	}

	// The main game loop
	function update() {

		//  Collide the player and the stars with the platforms
		game.physics.arcade.collide(player, bacteria);

		//  Reset the player's velocity (movement)
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
	}

})();
