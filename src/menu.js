
/**
 * menu.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// Sound
	var menuMusic;

	// Phaser functions
	var Menu = window.Menu = {

		preload: function() {
			// Load all the needed resources for the menu.
			GameInstance.load.image('background', './assets/background.png');
			GameInstance.load.image('start', './assets/startLogo.png');
			GameInstance.load.image('gameLogo', './assets/gameLogo.png');
			GameInstance.load.image('instructionsButton', './assets/instructionsLogo.png');
			GameInstance.load.audio('menuMusic', 'assets/menu_loop.wav');
		},

		create: function () {
			
			// Add menu screen.
			// It will act as a button to start the game.
			GameInstance.add.sprite(0, 0, "background");
			gameLogo = GameInstance.add.sprite(WIDTH / 2 , HEIGHT / 5, 'gameLogo', Menu);
			startButton = GameInstance.add.button(WIDTH/2, HEIGHT/2, 'start', Menu.startGame, Menu);
			instructionsButton = GameInstance.add.button(WIDTH/2, HEIGHT/2 + 100, 'instructionsButton', Menu.startInstructions, Menu);

			gameLogo.anchor.x = 0.5;
			gameLogo.anchor.y = 0.5;

			startButton.anchor.x = 0.5;
			startButton.anchor.y = 0.5;

			instructionsButton.anchor.x = 0.5;
			instructionsButton.anchor.y = 0.5;

			menuMusic = GameInstance.add.audio('menuMusic');
			menuMusic.loopFull(0.2);
		},

		startGame: function () {
			menuMusic.stop();
			// Change the state to the actual game.
			GameInstance.state.start('Game');
		},

		startInstructions: function () {
			menuMusic.stop();
			// Change the state to the instructions.
			GameInstance.state.start('Instructions');
		}

	};

})();
