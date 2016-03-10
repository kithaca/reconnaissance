var Util = require('./util');
var MovingObject = require('./movingObject');
var Player = require('./player');

var Enemy = function(pos, game) {
  this.type = "enemy";
  this.vel = Util.randomVec(10);
  this.color = "crimson";
  this.radius = 10;
  this.pos = pos;
  this.game = game;
  this.type = "moving";
  this.maxVel = 5;
};

Util.inherits(Enemy, MovingObject);

Enemy.prototype.followPlayer = function () {
  var delta = this.delta();
  this.power(delta);
};

Enemy.prototype.delta = function () {
  var dx = this.pos[0] - this.game.player.pos[0];
  var dy = this.pos[1] - this.game.player.pos[1];
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

  // debugger;
  // var velX = this.vel[0] + dir[0] * 0.5;
  // var velY = this.vel[1] + dir[1] * 0.5;
  // var newVel = [velX, velY];


  // if (Util.velocity(newVel) > this.maxVel) {
  //   newVel[0] *= 0.01;
  //   newVel[1] *= 0.01;
  // }
    // this.vel = newVel;
};

// var NORMAL_FRAME_DELTA = 1000/60;
// Enemy.prototype.move = function (delta) {
//   debugger;
//   var velocityScale = delta / NORMAL_FRAME_DELTA;
//
//   if (this.game.flagCaptured) {
//     this.followPlayer();
//   }
//
//   var xOffset = this.vel[0] * velocityScale;
//   var yOffset = this.vel[1] * velocityScale;
//
//   var newPos = [this.pos[0] + xOffset, this.pos[1] + yOffset];
//   newPos[0] += this.vel[0];
//   newPos[1] += this.vel[1];
//
//   var newSpecs = this.checkEdges(newPos, this.vel);
//   this.pos = newSpecs[0];
//   this.vel = newSpecs[1];
//
//   var newerSpecs = this.checkObstacles(this.pos, this.vel);
//   this.pos = newerSpecs[0];
//   this.vel = newerSpecs[1];
//
//   var that = this;
//   that.game.movingObjects().forEach(function (obj) {
//     // debugger;
//     if (that.collidesWith(obj)) {
//       obj.vel[0] *= -1;
//       obj.vel[1] *= -1;
//       obj.pos[0] += obj.vel[0];
//       obj.pos[1] += obj.vel[1];
//       that.vel[0] *= -1;
//       that.vel[1] *= -1;
//       that.pos[0] += that.vel[0];
//       that.pos[1] += that.vel[1];
//     }
//   });
//
// };

// Enemy.prototype.collidesWith = function (otherObject) {
  // if (otherObject instanceof Ship &&
  //    this.distance(otherObject) < this.radius + otherObject.radius) {
  //     otherObject.relocate();
  // }
// };

module.exports = Enemy;
