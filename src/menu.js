
/**
 * menu.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// Game objects
	var startButton;

	// Phaser functions
	var Menu = window.Menu = {

		preload: function() {
			// Load all the needed resources for the menu.
			GameInstance.load.image('background', './assets/background.png');
			GameInstance.load.image('start', './assets/startLogo.png');
            game.load.image('gameLogo', './assets/gameLogo.png');
		},

		create: function () {
			console.log("background created");
			// Add menu screen.
			// It will act as a button to start the game.
			this.add.sprite(0, 0, "background");
            gameLogo = this.add.sprite(WIDTH / 2 , HEIGHT / 4, 'gameLogo', this);
			startButton = this.add.button(WIDTH/2, HEIGHT/2, 'start', this.startGame, this);

            gameLogo.anchor.x = 0.5;
            gameLogo.anchor.y = 0.5;

			startButton.anchor.x = 0.5;
			startButton.anchor.y = 0.5;
		},

		startGame: function () {
			// Change the state to the actual game.
			this.state.start('Game');
		}

	};

})();

