/*global Phaser*/
var game;

import Boot from "./states/Boot.js";
import Preload from "./states/Preload.js";
import Menu from "./states/Menu.js";
import Level1 from "./states/Level1.js";
import Level2 from "./states/Level2.js";
import GameOver from "./states/GameOver.js";

window.onload = function () {
    game = new Phaser.Game(1200, 800);
    game.state.add('boot', Boot);
    game.state.add('preload', Preload);
    game.state.add('menu', Menu);
    game.state.add('level1', Level1);
    game.state.add('level2', Level2);
    game.state.add('game_over', GameOver);
    game.state.start('boot');
    
};