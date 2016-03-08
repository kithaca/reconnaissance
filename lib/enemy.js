var Util = require('./util');
var MovingObject = require('./movingObject');
var Player = require('./player');

var Enemy = function(pos, game) {
  this.vel = Util.randomVec(10);
  this.color = "red";
  this.radius = 10;
  this.pos = pos;
  this.game = game;
};

Util.inherits(Enemy, MovingObject);

Enemy.prototype.collidesWith = function (otherObject) {
  // if (otherObject instanceof Ship &&
  //    this.distance(otherObject) < this.radius + otherObject.radius) {
  //     otherObject.relocate();
  // }
};

module.exports = Enemy;
