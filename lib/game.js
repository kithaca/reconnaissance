var Player = require('./player');
var Enemy = require('./enemy');

var Game = function () {
  this.DIM_X = 1200;
  this.DIM_Y = 1000;
  this.NUM_ENEMIES = 5;
  this.obstacles = this.addObstacles();
  this.enemies = this.addEnemy();
  this.player = this.addPlayer();
};

Game.prototype.allObjects = function () {
  return (this.enemies.concat(this.player, this.obstacles));
};

Game.prototype.addHome = function () {
  var homeBase = {
    type: "base",
    x: 100,
    y: 100,
    width: 40,
    height: 40,

  }
}

Game.prototype.addObstacles = function () {
  var obs1 = {
    type: "obstacle",
    x: 100,
    y: 100,
    width: 20,
    height: 20,
    fillStyle: "blue"
  }

  return [obs1];
  // ctx.fillStyle = "blue";
  // ctx.fillRect(obs1.x, obs1.y, obs1.width, obs1.height);
}

Game.prototype.addPlayer = function () {
  return new Player([400, 300], this);
};

Game.prototype.addEnemy = function () {
  var enemies = [];
  for (var i=0; i<this.NUM_ENEMIES; i++) {
    enemies.push(new Enemy(this.randomPosition(), this));
  }
  return enemies;
};

Game.prototype.randomPosition = function () {
  var randX = Math.floor(Math.random() * 700);
  var randY = Math.floor(Math.random() * 500);
  return [randX, randY];
}

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.allObjects().forEach(function (obj) {
    if (obj.type === "obstacle") {
      ctx.fillStyle = "cornflowerblue";
      ctx.fillRect(obj.x, obj.y, obj.height, obj.width);
    } else {
      obj.draw(ctx);
    }
  });
};

Game.prototype.moveObjects = function (ctx) {
  this.allObjects().forEach(function (obj) {
    if (obj.type !== "obstacle") {
      obj.move(ctx);
    }
  });
};

Game.prototype.wrap = function (pos) {
  var x = pos[0];
  var y = pos[1];
  if (x > this.DIM_X) {
    x = 0;
  } else if (x <= 0) {
    x = this.DIM_X;
  } else if (y >= this.DIM_Y) {
    y = 0;
  } else if (y <= 0) {
    y = this.DIM_Y;
  }
  return [x, y];
};

Game.prototype.checkCollisions = function () {
  game = this;
  for (var i=0; i<game.NUM_ENEMIES-1; i++) {
    if (game.enemies[i].collidesWith(game.player)) {
      game.player.relocate();
    }
  }
};

Game.prototype.remove = function (enemy) {
  var idx = this.enemies.indexOf(enemy);
  this.enemies.splice(idx, 1);
  this.NUM_ENEMIES = this.enemies.length;
};

Game.prototype.step = function (ctx) {
  this.moveObjects(ctx);
  this.checkCollisions();
};

module.exports = Game;
