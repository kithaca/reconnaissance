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
  view = this;

  setInterval(function() {
    view.game.draw(view.ctx);
    view.game.step(view.ctx);

  }, 20);
};

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
