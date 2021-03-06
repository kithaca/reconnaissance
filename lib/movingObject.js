var Util = require('./util');

var MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.color = options.color;
  this.game = options.game;
};

MovingObject.prototype.distance = function (otherObject) {
  var x1 = this.pos[0], y1 = this.pos[1];
  var x2 = otherObject.pos[0], y2 = otherObject.pos[1];
  var xDiff = x1 - x2;
  var yDiff = y1 - y2;
  return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
};


MovingObject.prototype.collidesWith = function (otherObject) {
  if ((this.distance(otherObject)) < (this.radius + otherObject.radius)) {
    return true;
  } else {
    return false;
  }
};

MovingObject.prototype.checkEdges = function (pos, vel) {
  var x = pos[0];
  var y = pos[1];
  var velX = vel[0];
  var velY = vel[1];

  if (x > this.game.DIM_X) {
    x = this.game.DIM_X;
    velX *= -0.5;
  } else if (x <= 0) {
    x = 0;
    velX *= -0.5;
  } else if (y >= this.game.DIM_Y) {
    y = this.game.DIM_Y;
    velY *= -0.5;
  } else if (y <= 0) {
    y = 0;
    velY *= -0.5;
  }
  var newPos = [x, y];
  var newVel =[velX, velY];
  return [newPos, newVel];
};

MovingObject.prototype.checkObstacles = function (pos, vel) {
  var x = pos[0];
  var y = pos[1];
  var velX = vel[0];
  var velY = vel[1];
  var that = this;

  this.game.obstacles.forEach(function (obs) {
    var xBounds = [obs.x, obs.x + obs.width];
    var yBounds = [obs.y, obs.y + obs.height];

    if ((x + that.width) >= xBounds[0] && x <= xBounds[1] &&
        (y + that.height) >= yBounds[0] && y <= yBounds[1]) {
          // debugger;
          velX *= -0.8;
          velY *= -0.8;
    }

  });
  return [[x, y], [velX, velY]];

};

MovingObject.prototype.dampen = function () {
  this.vel[0] *= 0.95;
  this.vel[1] *= 0.95;
};

var NORMAL_FRAME_DELTA = 1000/60;
MovingObject.prototype.move = function (delta) {

  if (this.game.flagCaptured) {
    this.followPlayer();
  } else {
    this.randomTrajectory();
  }

  var velocityScale = delta / NORMAL_FRAME_DELTA;
  var xOffset = this.vel[0] * velocityScale;
  var yOffset = this.vel[1] * velocityScale;

  var newPos = [this.pos[0] + xOffset, this.pos[1] + yOffset];
  newPos[0] += this.vel[0];
  newPos[1] += this.vel[1];

  var newSpecs = this.checkEdges(newPos, this.vel);
  this.pos = newSpecs[0];
  this.vel = newSpecs[1];

  var newerSpecs = this.checkObstacles(this.pos, this.vel);
  this.pos = newerSpecs[0];
  this.vel = newerSpecs[1];

  var that = this;
  that.game.movingObjects().forEach(function (obj) {
    if (that !== obj && that.collidesWith(obj)) {
      if (that.game.flagCaptured && obj === that.game.player) {
        that.game.flagCaptured = false;
        that.game.player.relocate();
      } else if (that !== that.game.player && obj !== that.game.player) {
        debugger;
        var tempX = obj.vel[0];
        var tempY = obj.vel[1];
        obj.vel[0] = that.vel[0] * 0.8;
        obj.vel[1] = that.vel[1] * 0.8;
        obj.pos[0] += obj.vel[0];
        obj.pos[1] += obj.vel[1];
        that.vel[0] = tempX * 0.8;
        that.vel[1] = tempY * 0.8;
        that.pos[0] += that.vel[0];
        that.pos[1] += that.vel[1];
      }
    }
  });

};

module.exports = MovingObject;
