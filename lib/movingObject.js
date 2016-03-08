var MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
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

MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );
  ctx.fill();
};

MovingObject.prototype.move = function () {
  newPos = [this.pos[0], this.pos[1]];
  newPos[0] += this.vel[0];
  newPos[1] += this.vel[1];
  this.pos = this.game.wrap(newPos);
};

module.exports = MovingObject;
