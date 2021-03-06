var Util = require('./util');
var MovingObject = require('./movingObject');

var Player = function(pos, game) {
  this.vel = [0, 0];
  this.color = "blue";
  this.radius = 10;
  this.pos = pos;
  this.game = game;
  this.type = "moving";
  this.maxVel = 4.5;
  this.img = new Image();
  this.img.src = 'playerShip.png';
  this.width = 30;
  this.height = 20;
};

Util.inherits(Player, MovingObject);

Player.prototype.draw = function (ctx) {
  ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);
};

Player.prototype.relocate = function () {
  this.pos = [this.game.homeBase.x + 50, this.game.homeBase.y + 50];
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
  var radius = this.game.enemyBase.width / 4;
  base.pos = [this.game.enemyBase.x + radius, this.game.enemyBase.y + radius];

  if (this.distance(base) <= this.width / 2) {
    this.game.flagCaptured = true;
  }
};

Player.prototype.flagDelivered = function () {
  var base = {};
  var radius = this.game.homeBase.width / 2;
  base.pos = [this.game.homeBase.x + radius, this.game.homeBase.y + radius];

  if (this.distance(base) <= this.width / 2) {
    // debugger;
    return true;
  } else {
    return false;
  }
};



module.exports = Player;
