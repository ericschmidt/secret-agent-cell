
/**
 * instructions.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// Game objects
	var instructionsText = "Welcome Secret Agent White Blood Cell! \n We have an emergency on our hands! We are being attacked by mutant bacteria \n that want to declare war!  It is your job to destroy them and save our body! \n \n Your goal is to dodge the bullets to survive long enough to kill all of the \n infections! Bacteria will turn dark right before they will shoot. \n You will lose health for every bullet you hit. If you lose all your \n health, you fail your mission! You will regenerate health slowly over time. \n \n Use ARROW KEYS to move yourself to dodge bullets. \n Kill a bacteria by pressing SPACE while right next to it. \n \n Good luck Secret Agent! Your body is counting on you!"

	// Phaser functions
	var Instructions = window.Instructions = {

		preload: function() {
			// Load all the needed resources for the Instructions.
			GameInstance.load.image('background', './assets/background.png');
			
			GameInstance.load.image('gameLogo', './assets/gameLogo.png');
			GameInstance.load.image('instructionsLogo', './assets/instructionsLogo.png');
			GameInstance.load.image('menuButton', './assets/menuLogo.png');

		},

		create: function () {
			
			// Add Instructions screen.
			// It will act as a button to start the game.
			Instructions.add.sprite(0, 0, "background");
			instructionsLogo = Instructions.add.sprite(WIDTH / 2 , HEIGHT / 6, 'instructionsLogo', Instructions);

			var style = { font: "18px Verdana", fill: "#000", wordWrap: false, align: "center", backgroundColor: "rgba(0,0,0,0)" };
			text = Instructions.add.text(WIDTH / 2, HEIGHT / 2 + 30,  instructionsText, style);


			
			menuButton = Instructions.add.button(WIDTH , HEIGHT, 'menuButton', Instructions.startMenu, Instructions);


			instructionsLogo.anchor.x = 0.5;
			instructionsLogo.anchor.y = 0.5;

			text.anchor.x = 0.5;
			text.anchor.y = 0.5;




			menuButton.anchor.x = 1.0;
			menuButton.anchor.y = 1.0;
		},

		startGame: function () {
			// Change the state to the actual game.
			Instructions.state.start('Game');
		},

		startMenu: function () {
			// Change the state to the actual game.
			Instructions.state.start('Menu');
		}

	};

})();

