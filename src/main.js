/**
 * main.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

(function() {

	// Screen size
	var WIDTH = window.WIDTH = 800;
	var HEIGHT = window.HEIGHT = 600;

	// Create a new game instance (which is global so all files can access it)
	window.GameInstance = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);

	// First parameter is how our state will be called.
	// Second parameter is an object containing the needed methods for state functionality
	GameInstance.state.add('Menu', Menu);
	GameInstance.state.add('Game', Game);
	GameInstance.state.add('Instructions', Instructions);
	GameInstance.state.add('GameOver', GameOver);
	GameInstance.state.add('LevelPassed', LevelPassed);

	// Start in the 'menu' state
	GameInstance.state.start('Menu');

})();
