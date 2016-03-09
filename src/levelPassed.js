
/**
 * levelPassed.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// Game objects
	var levelPassedText = "You have succeeded in your mission! \n Press 'R' to replay!"

	// Phaser functions
	var LevelPassed = window.LevelPassed = {

		preload: function() {
			// Load all the needed resources for the LevelPassed.
			GameInstance.load.image('background', './assets/background.png');
			
			GameInstance.load.image('levelPassedLogo', './assets/levelPassedLogo.png');
			
			GameInstance.load.image('menuButton', './assets/menuLogo.png');

		},

		create: function () {
			
			// Add LevelPassed screen.
			// It will act as a button to start the game.
			LevelPassed.add.sprite(0, 0, "background");
			levelPassedLogo = LevelPassed.add.sprite(WIDTH / 2 , HEIGHT / 3, 'levelPassedLogo', LevelPassed);

			var style = { font: "30px Verdana", fill: "#111", wordWrap: false, align: "center", backgroundColor: "rgba(0,0,0,0)" };
			text = LevelPassed.add.text(WIDTH / 2, HEIGHT / 2 + 20,  levelPassedText, style);


			
			menuButton = LevelPassed.add.button(WIDTH , HEIGHT, 'menuButton', LevelPassed.startMenu, LevelPassed);


			levelPassedLogo.anchor.x = 0.5;
			levelPassedLogo.anchor.y = 0.5;

			text.anchor.x = 0.5;
			text.anchor.y = 0.5;




			menuButton.anchor.x = 1.0;
			menuButton.anchor.y = 1.0;

			keys = GameInstance.input.keyboard.addKeys({
				'replay': Phaser.Keyboard.R
			});
		},

		startMenu: function () {
			// Change the state to the actual game.
			LevelPassed.state.start('Menu');
		},
		update: function () {
			// Change the state to the actual game.
			if(keys.replay.isDown){
				LevelPassed.state.start('Game');
			}
			
		}


	};

})();

