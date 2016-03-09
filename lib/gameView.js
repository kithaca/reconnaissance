var GameView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
};

GameView.MOVES = {
  37: [-1, 0],
  39: [1, 0],
  38: [0, -1],
  40: [0, 1]
};

GameView.prototype.start = function () {
  this.bindKeyHandlers();
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
  view = this;
};

GameView.prototype.animate = function (time) {
  var delta = time - this.lastTime;
  this.game.step(delta);
  this.game.draw(view.ctx);
  this.lastTime = time;

  requestAnimationFrame(this.animate.bind(this));
}

GameView.prototype.bindKeyHandlers = function () {
  var player = this.game.player;
  var move;
  var that = this;

  document.onkeydown = function (e) {
    e.preventDefault();
    move = GameView.MOVES[e.keyCode];
    player.power(move);
  }

};

module.exports = GameView;
