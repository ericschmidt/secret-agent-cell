/**
 * main.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// GAME VARIABLES
	var attack;
	var player;
	var bacteria;
	var cursors;
	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	// HELPER FUNCTIONS

	function collectStar (player, star) {
		
		// Removes the star from the screen
		star.kill();

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

		//  We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//  A simple background for our game
		//game.add.sprite(0, 0, 'sky');

		//  The platforms group contains the ground and the 2 ledges we can jump on
		bacteria = game.add.group();

		//  We will enable physics for any object that is created in this group
		bacteria.enableBody = true;

		// Here we create the ground.
		var group1 = bacteria.create(20, 20, 'bacteria');

		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		//ground.scale.setTo(2, 2);

		//  This stops it from falling away when you jump on it
		group1.body.immovable = true;


		// The player and its settings
		player = game.add.sprite(32, game.world.height - 150, 'player');

		//  We need to enable physics on the player
		game.physics.arcade.enable(player);

		//  Player physics properties. Give the little guy a slight bounce.
		//player.body.bounce.y = 0.2;
		//player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;

		//  Our two animations, walking left and right.
		//player.animations.add('left', [0, 1, 2, 3], 10, true);
		//player.animations.add('right', [5, 6, 7, 8], 10, true);

		//  Our controls.
		cursors = game.input.keyboard.createCursorKeys();
		
	}

	// The main game loop
	function update() {

		//  Collide the player and the stars with the platforms
		game.physics.arcade.collide(player, bacteria);

		//  Reset the players velocity (movement)
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;

		if (cursors.left.isDown)
		{
			//  Move to the left
			player.body.velocity.x = -150;

		}
		if (cursors.right.isDown)
		{
			//  Move to the right
			player.body.velocity.x = 150;

		}
		if (cursors.up.isDown)
		{
			// Move up

			player.body.velocity.y = -150;
		}
		if (cursors.down.isDown)
		{
			// Move down

			player.body.velocity.y = 150;
		}
		else
		{
			player.body.velocity
		}

	}

})();
