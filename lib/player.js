var Util = require('./util');
var MovingObject = require('./movingObject');

var Player = function(pos, game) {
  this.vel = [0, 0];
  this.color = "blue";
  this.radius = 10;
  this.pos = pos;
  this.game = game;
  this.type = "moving";
  this.maxVel = 5.5;
};

Util.inherits(Player, MovingObject);

Player.prototype.relocate = function () {
  this.pos = [this.game.homeBase.x, this.game.homeBase.y];
  this.vel = [0, 0];
};

Player.prototype.power = function (dir) {
  var velX = this.vel[0] + dir[0] * 0.5;
  var velY = this.vel[1] + dir[1] * 0.5;
  var newVel = [velX, velY];

  if (Util.velocity(newVel) < this.maxVel) {
    this.vel = newVel;
  }

};

Player.prototype.followPlayer = function () {
  // do nothing
};

Player.prototype.randomTrajectory = function () {
  // do nothing
};

Player.prototype.getFlag = function () {
  var base = {};
  var radius = this.game.enemyBase.width;
  base.pos = [this.game.enemyBase.x + radius/2, this.game.enemyBase.y + radius/2];

  if (this.distance(base) <= this.radius) {
    this.game.flagCaptured = true;
  }
};

Player.prototype.flagDelivered = function () {
  var base = {};
  var radius = this.game.homeBase.width;
  base.pos = [this.game.homeBase.x + radius/2, this.game.homeBase.y + radius/2];

  if (this.distance(base) <= this.radius) {
    return true;
  } else {
    return false;
  }
};



module.exports = Player;
