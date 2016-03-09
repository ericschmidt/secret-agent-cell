
/**
 * menu.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {



	// Phaser functions
	var Menu = window.Menu = {

		preload: function() {
			// Load all the needed resources for the menu.
			GameInstance.load.image('background', './assets/background.png');
			GameInstance.load.image('start', './assets/startLogo.png');
            GameInstance.load.image('gameLogo', './assets/gameLogo.png');
            GameInstance.load.image('instructionsButton', './assets/instructionsLogo.png');
		},

		create: function () {
			
			// Add menu screen.
			// It will act as a button to start the game.
			Menu.add.sprite(0, 0, "background");
            gameLogo = Menu.add.sprite(WIDTH / 2 , HEIGHT / 5, 'gameLogo', Menu);
			startButton = Menu.add.button(WIDTH/2, HEIGHT/2, 'start', Menu.startGame, Menu);
            instructionsButton = Menu.add.button(WIDTH/2, HEIGHT/2 + 100, 'instructionsButton', Menu.startInstructions, Menu);


            gameLogo.anchor.x = 0.5;
            gameLogo.anchor.y = 0.5;

			startButton.anchor.x = 0.5;
			startButton.anchor.y = 0.5;

            instructionsButton.anchor.x = 0.5;
            instructionsButton.anchor.y = 0.5;
		},

		startGame: function () {
			// Change the state to the actual game.
			Menu.state.start('Game');
		},

        startInstructions: function () {
            // Change the state to the instructions.
            console.log('instruct');
            Menu.state.start('Instructions');
        }

	};

})();

