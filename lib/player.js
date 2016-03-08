var Util = require('./util');
var MovingObject = require('./movingObject');

var Player = function(pos, game) {
  this.vel = [0, 0];
  this.color = "cornflowerblue";
  this.radius = 10;
  this.pos = pos;
  this.game = game;
};

Util.inherits(Player, MovingObject);

Player.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

Player.prototype.power = function (dir) {
  this.vel[0] += dir[0] * 0.5;
  this.vel[1] += dir[1] * 0.5;
};

module.exports = Player;
