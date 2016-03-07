/**
 * main.js
 * Secret Agent Cell
 *
 * Dylan Ho, Eric Schmidt, Lisa Ruan, Erica Yuen
 */

var game;

// SCREEN SIZE
var WIDTH = 800;
var HEIGHT = 600;

// Create a new game instance 600px wide and 450px tall:
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO );

// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality
game.state.add('Menu', Menu);
game.state.add('Game', Game);

console.log("background created");
game.state.start('Menu');

