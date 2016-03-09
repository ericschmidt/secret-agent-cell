
/**
 * gameOver.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// Game objects
	var gameOverText = "You have failed your mission! \n Press 'R' to replay!"

	// Phaser functions
	var GameOver = window.GameOver = {

		preload: function() {
			// Load all the needed resources for the GameOver.
			GameInstance.load.image('background', './assets/background.png');
			
			GameInstance.load.image('gameOverLogo', './assets/gameOverLogo.png');
			
			GameInstance.load.image('menuButton', './assets/menuLogo.png');

		},

		create: function () {
			
			// Add GameOver screen.
			// It will act as a button to start the game.
			GameOver.add.sprite(0, 0, "background");
			gameOverLogo = GameOver.add.sprite(WIDTH / 2 , HEIGHT / 3, 'gameOverLogo', GameOver);

			var style = { font: "30px Verdana", fill: "#111", wordWrap: false, align: "center", backgroundColor: "rgba(0,0,0,0)" };
			text = GameOver.add.text(WIDTH / 2, HEIGHT / 2 + 20,  gameOverText, style);


			
			menuButton = GameOver.add.button(WIDTH , HEIGHT, 'menuButton', GameOver.startMenu, GameOver);


			gameOverLogo.anchor.x = 0.5;
			gameOverLogo.anchor.y = 0.5;

			text.anchor.x = 0.5;
			text.anchor.y = 0.5;




			menuButton.anchor.x = 1.0;
			menuButton.anchor.y = 1.0;

			keys = GameInstance.input.keyboard.addKeys({
				'replay': Phaser.Keyboard.R
			});
		},

		startGame: function () {
			// Change the state to the actual game.
			GameOver.state.start('Game');
		},

		startMenu: function () {
			// Change the state to the actual game.
			GameOver.state.start('Menu');
		},
		update: function () {
			// Change the state to the actual game.
			if(keys.replay.isDown){
				GameOver.state.start('Game');
			}
			
		}


	};

})();

