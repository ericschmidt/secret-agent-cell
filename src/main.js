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

	// Create a new game instance
	var game = window.GameInstance = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);

	// First parameter is how our state will be called.
	// Second parameter is an object containing the needed methods for state functionality
	game.state.add('Menu', Menu);
	game.state.add('Game', Game);

	// Start in the 'menu' state
	game.state.start('Menu');

})();
