
/**
 * credits.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// Game objects
	var creditsText = "Game created by: Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen \n \n Built with Phaser 2.4.6 \n \n Art Work: Lisa Ruan, Erica Yuen \n \n Sound: freesound.com";

	// Phaser functions
	var Credits = window.Credits = {

		preload: function() {
			// Load all the needed resources for the Credits.
			GameInstance.load.image('background', './assets/background.png');
			
			GameInstance.load.image('gameLogo', './assets/gameLogo.png');
			GameInstance.load.image('creditsLogo', './assets/creditsLogo.png');
			GameInstance.load.image('menuButton', './assets/menuLogo.png');

		},

		create: function () {
			
			// Add Credits screen.
			// It will act as a button to start the game.
			GameInstance.add.sprite(0, 0, "background");
			creditsLogo = GameInstance.add.sprite(WIDTH / 2 , HEIGHT / 6, 'creditsLogo', Credits);

			var style = { font: "18px Verdana", fill: "#000", wordWrap: false, align: "center", backgroundColor: "rgba(0,0,0,0)" };
			text = GameInstance.add.text(WIDTH / 2, HEIGHT / 2 + 30,  creditsText, style);


			
			menuButton = GameInstance.add.button(WIDTH , HEIGHT, 'menuButton', Credits.startMenu, Credits);


			creditsLogo.anchor.x = 0.5;
			creditsLogo.anchor.y = 0.5;

			text.anchor.x = 0.5;
			text.anchor.y = 0.5;




			menuButton.anchor.x = 1.0;
			menuButton.anchor.y = 1.0;
		},

		startGame: function () {
			// Change the state to the actual game.
			GameInstance.state.start('Game');
		},

		startMenu: function () {
			// Change the state to the actual game.
			GameInstance.state.start('Menu');
		}

	};

})();
