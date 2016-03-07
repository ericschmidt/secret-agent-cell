var Menu = {

    preload : function() {
        // Load all the needed resources for the menu.
        
        game.load.image('background', './assets/background.png');
        game.load.image('start', './assets/startLogo.png');
    },

    create: function () {
        console.log("background created");
        // Add menu screen.
        // It will act as a button to start the game.
        this.add.sprite(0, 0, "background");
        this.add.button(WIDTH / 2 , HEIGHT / 2, 'start', this.startGame, this);

    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }

};