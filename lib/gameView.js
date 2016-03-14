var key = require('./keymaster.js');

var GameView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
  this.paused = false;
};

GameView.MOVES = {
  "left": [-1, 0],
  "right": [1, 0],
  "up": [0, -1],
  "down": [0, 1]
};

GameView.prototype.start = function () {
  this.bindPause();
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
  view = this;
};

GameView.prototype.animate = function (time) {
  if (!this.paused) {
    var delta = time - this.lastTime;
    this.game.step(delta);
    this.game.draw(view.ctx);
    this.lastTime = time;
    this.checkKey();
    requestAnimationFrame(this.animate.bind(this));
  } else {
    requestAnimationFrame(this.animate.bind(this));
  }

};

GameView.prototype.pause = function () {
  this.paused = this.paused ? false : true;
};

GameView.prototype.bindPause = function () {
  var that = this;
  document.onkeydown = function (e) {
    e.preventDefault();
    if (e.keyCode === 32) {
      that.pause()
    }
  }
};

GameView.prototype.checkKey = function () {

  if (key.isPressed("left") && key.isPressed("up")) {
    this.game.player.power([-0.7071, -0.7071]);
  } else if (key.isPressed("left") && key.isPressed("down")) {
    this.game.player.power([-0.7071, 0.7071]);
  } else if (key.isPressed("right") && key.isPressed("up")) {
    this.game.player.power([0.7071, -0.7071]);
  } else if (key.isPressed("right") && key.isPressed("down")) {
    this.game.player.power([0.7071, 0.7071]);
  } else if (key.isPressed("left")) {
    this.game.player.power(GameView.MOVES["left"])
  } else if (key.isPressed("right")) {
    this.game.player.power(GameView.MOVES["right"])
  } else if (key.isPressed("up")) {
    this.game.player.power(GameView.MOVES["up"])
  } else if (key.isPressed("down")) {
    this.game.player.power(GameView.MOVES["down"])
  }


};

module.exports = GameView;

// GameView.prototype.bindKeyHandlers = function () {
//   var player = this.game.player;
//   var move;
//   var that = this;
//
//   Object.keys(GameView.MOVES).forEach(function (k) {
//       var move = GameView.MOVES[k];
//
//       key(k, function () {
//         player.power(move);
//       });
//     });

// document.onkeydown = function (e) {
//   e.preventDefault();
//   move = GameView.MOVES[e.keyCode];
//   player.power(move);
// }

// };
