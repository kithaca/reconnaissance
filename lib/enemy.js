var Util = require('./util');
var MovingObject = require('./movingObject');
var Player = require('./player');

var Enemy = function(pos, game) {
  this.type = "enemy";
  this.vel = Util.randomVec(2);
  this.color = "green";
  this.radius = 10;
  this.width = 30;
  this.height = 20;
  this.pos = pos;
  this.game = game;
  this.type = "moving";
  this.maxVel = 1.5;
  this.goal = this.generateDestination();
  this.img = new Image();
  this.img.src = 'enemyShip.png';
};

Util.inherits(Enemy, MovingObject);

Enemy.prototype.draw = function (ctx) {
  ctx.drawImage(this.img, this.pos[0], this.pos[1], this.width, this.height);
};

Enemy.prototype.followPlayer = function () {
  var delta = this.delta(this.game.player.pos);
  this.power(delta);
};

Enemy.prototype.generateDestination = function () {
  var goal = {};
  goal.pos = this.game.randomPosition();
  return goal;
};

Enemy.prototype.randomTrajectory = function () {
  if (this.distance(this.goal) < (100)) {
    this.goal = this.generateDestination();
  }

  var delta = this.delta(this.goal.pos);
  this.power(delta);
};

Enemy.prototype.delta = function (pos) {
  var dx = this.pos[0] - pos[0];
  var dy = this.pos[1] - pos[1];
  return [-dx, -dy];
};

Enemy.prototype.power = function (dir) {
  var hypotenuse = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
  var x = Math.sqrt((dir[0] * dir[0]) / (hypotenuse * hypotenuse));
  var y = Math.sqrt((dir[1] * dir[1]) / (hypotenuse * hypotenuse));


  if (Util.velocity(this.vel) < this.maxVel) {
    if (dir[0] > 0) {
      this.vel[0] += x * 0.5;
    } else {
      this.vel[0] -= x * 0.5;
    }
    if (dir[1] > 0) {
      this.vel[1] += y * 0.5;
    } else {
      this.vel[1] -= y * 0.5;
    }
  }

};

module.exports = Enemy;
