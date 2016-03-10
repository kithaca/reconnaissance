var Util = require('./util');
var MovingObject = require('./movingObject');

var EnemyPlayer = function(pos, game) {
  this.vel = [0, 0];
  this.color = "purple";
  this.radius = 10;
  this.pos = pos;
  this.game = game;
  this.type = "moving";
  this.maxVel = 6;
};

EnemyPlayer.prototype.getFlag = function () {
  // debugger;
  var base = {};
  var radius = this.game.enemyBase.width;
  base.pos = [this.game.enemyBase.x + radius, this.game.enemyBase.y + radius];

  if (this.distance(base) < this.game.enemyBase.width) {
    this.game.homeFlagCaptured = true;
  }
};

Util.inherits(EnemyPlayer, MovingObject);

module.exports = EnemyPlayer;
