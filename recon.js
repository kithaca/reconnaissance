var GameView = require('./lib/gameView');
var Game = require('./lib/game');

var canvas = document.getElementById('canvas');
canvas.width = 1200;
canvas.height = 1000;

var ctx = canvas.getContext('2d');
ctx.backgroundColor = "midnightblue"

var g = new GameView(new Game(), ctx);

g.start();
