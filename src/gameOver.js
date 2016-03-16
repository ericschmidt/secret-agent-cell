
/**
 * gameOver.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */



(function() {





	// Game objects
	var failText = "You have failed your mission! \n Press 'R' to replay!"
	var scoreText = "Score: ";



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
			GameInstance.add.sprite(0, 0, "background");
			gameOverLogo = GameInstance.add.sprite(WIDTH / 2 , HEIGHT / 3, 'gameOverLogo', GameOver);

			var style = { font: "bolder 30px Open Sans", fill: "#fff", wordWrap: false, align: "center", backgroundColor: "rgba(0,0,0,0)" };
			scoreText = GameInstance.add.text(WIDTH / 2, HEIGHT / 2 , scoreText+window.gameScore+' ', style);

			gameOverText = GameInstance.add.text(WIDTH / 2, HEIGHT / 2 + 80, failText, style);

			

			menuButton = GameInstance.add.button(WIDTH, HEIGHT - 8, 'menuButton', GameOver.startMenu, GameOver);


			gameOverLogo.anchor.x = 0.5;
			gameOverLogo.anchor.y = 0.5;

			gameOverText.anchor.x = 0.5;
			gameOverText.anchor.y = 0.5;

			gameOverText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

 	
			scoreText.anchor.x = 0.5;
			scoreText.anchor.y = 0.5;

			scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

			menuButton.anchor.x = 1.0;
			menuButton.anchor.y = 1.0;

			keys = GameInstance.input.keyboard.addKeys({
				'replay': Phaser.Keyboard.R
			});
		},

		startGame: function () {
			// Change the state to the actual game.
			GameInstance.state.start('Game');
		},

		startMenu: function () {
			// Change the state to the actual game.
			GameInstance.state.start('Menu');
		},
		update: function () {
			// Change the state to the actual game.
			if(keys.replay.isDown){
				GameInstance.state.start('Game');
			}
			
		}


	};

})();

