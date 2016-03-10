var GameView = require('./lib/gameView');
var Game = require('./lib/game');

var canvas = document.getElementById('canvas');
canvas.width = 1300;
canvas.height = 950;

var ctx = canvas.getContext('2d');

var g = new GameView(new Game(), ctx);

g.start();
