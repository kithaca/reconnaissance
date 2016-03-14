var Player = require('./player');
var Enemy = require('./enemy');
var MovingObject = require('./movingObject');
var EnemyPlayer = require('./enemyPlayer');

var Game = function () {
  this.DIM_X = 1100;
  this.DIM_Y = 650;
  this.NUM_ENEMIES = 5;
  this.obstacles = this.addObstacles();
  this.homeBase = this.addHomeBase();
  this.enemyBase = this.addEnemyBase();
  this.enemies = this.addEnemy();
  this.player = this.addPlayer();
  this.flag = this.addFlag();
  this.flagCaptured = false;
  this.homeFlagCaptured = false;
  this.points = 0;
};

Game.prototype.movingObjects = function () {
  return (this.enemies.concat([this.player]));
};

Game.prototype.allObjects = function () {
  return (this.enemies.concat(
    this.player,
    this.obstacles,
    [this.homeBase, this.enemyBase, this.flag]
  ));
};

Game.prototype.addHomeBase = function () {

  var img = new Image();
  img.src = "homePlanet.png";
  return {
    type: "homebase",
    img: img,
    x: 90,
    y: 90,
    width: 50,
    height: 50,
  };
};

Game.prototype.addEnemyBase = function () {
  var img = new Image();
  img.src = "enemyPlanet.png"
  return {
    type: "enemybase",
    img: img,
    x: this.DIM_X - 140,
    y: this.DIM_Y - 140,
    width: 55,
    height: 44,
  };
};

Game.prototype.addObstacles = function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var game = this;
  var img = new Image();
  img.src = "blackDots.png";
  var pattern = null;
  return [
    {
      type: "obstacle",
      img: img,
      pattern: pattern,
      x: 180,
      y: 100,
      width: 20,
      height: 80
    },

    {
      type: "obstacle",
      img: img,
      pattern: pattern,
      x: 180,
      y: 180,
      width: 20,
      height: 20
    },

    {
      type: "obstacle",
      img: img,
      pattern: pattern,
      x: 100,
      y: 180,
      width: 80,
      height: 20
    },

    {
      type: "obstacle",
      img: img,
      pattern: pattern,
      x: game.DIM_X - 180,
      y: game.DIM_Y - 200,
      width: 80,
      height: 20
    },

    {
      type: "obstacle",
      img: img,
      pattern: pattern,
      x: game.DIM_X - 200,
      y: game.DIM_Y - 200,
      width: 20,
      height: 100
    },

    {
      type: "obstacle",
      img: img,
      pattern: pattern,
      x: game.DIM_X - 200,
      y: game.DIM_Y - 200,
      width: 20,
      height: 20
    },

  ];
};

Game.prototype.addPlayer = function () {
  return new Player([this.homeBase.x, this.homeBase.y], this);
};

Game.prototype.addEnemy = function () {
  var enemies = [];
  for (var i=0; i<this.NUM_ENEMIES; i++) {
    enemies.push(new Enemy(this.randomPosition(), this));
  }
  return enemies;
};

Game.prototype.addEnemyPlayer = function () {
  return new EnemyPlayer([this.enemyBase.x, this.enemyBase.y], this);
};

Game.prototype.addFlag = function () {
  var img = new Image();
  img.src = 'betterflag.png';
  var game = this;

  return {
    type: "flag",
    img: img,
    x: game.enemyBase.x + 25,
    y: game.enemyBase.y - 10,
    width: 30,
    height: 30
  };
};

Game.prototype.randomPosition = function () {
  var randX = Math.floor(Math.random() * this.DIM_X);
  var randY = Math.floor(Math.random() * this.DIM_Y);
  return [randX, randY];
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  var that = this;
  this.drawScore();

  that.allObjects().forEach(function (obj) {
    if (obj.type === "obstacle") {
      var pattern = ctx.createPattern(obj.img, "repeat");
      ctx.fillStyle = pattern;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    } else if (obj.type === "homebase") {
      var homeBase = that.homeBase;
      ctx.drawImage(homeBase.img, homeBase.x, homeBase.y, homeBase.width, homeBase.height);
    } else if (obj.type === "enemybase") {
      var enemyBase = that.enemyBase;
      ctx.drawImage(enemyBase.img, enemyBase.x, enemyBase.y, enemyBase.width, enemyBase.height);
    } else if (obj.type === "flag") {
      if (!that.flagCaptured) {
        ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
      } else {
        ctx.drawImage(obj.img, that.player.pos[0] + 6, that.player.pos[1] - obj.height + 1, obj.width, obj.height);
      }
    } else {
      obj.draw(ctx);
    }
  });
};

Game.prototype.moveObjects = function (delta) {
  var that = this;
  this.movingObjects().forEach(function (obj) {
    obj.move(delta);
    obj.dampen();
  });

  if (!that.flagCaptured) {
    that.player.getFlag();
  } else if (that.player.flagDelivered()) {
    that.addPoint();
    that.flagCaptured = false;
  }
};

Game.prototype.drawScore = function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.font = "30px Verdana";
  ctx.fillStyle = "aquamarine";
  var score = this.points;
  ctx.fillText(score, this.DIM_X -50, 50);

};

Game.prototype.addPoint = function () {
  this.points++;
  this.enemies.forEach(function (enemy) {
    enemy.maxVel += 0.2;
  });
  // if (this.points === 3) {
  //   this.enemyPlayer = this.addEnemyPlayer();
  // }
  // this.changeColor();
};

var COLORS = [
  "cornsilk",
  "aquamarine",
  "blueviolet",
  "teal",
  "plum",
  "tomato",
  "palegoldenrod",
  "coral",
  "royalblue",
  "darkslategray",
  "dimgray",
  "black"
];

Game.prototype.changeColor = function () {
  var canvas = document.getElementById('canvas');
  var randIdx =  Math.floor(Math.random() * COLORS.length);

  canvas.style.backgroundColor = COLORS[randIdx];

};

Game.prototype.edges = function (pos) {
  var x = pos[0];
  var y = pos[1];

  if (x > this.DIM_X) {
    x = this.DIM_X;
  } else if (x <= 0) {
    x = 0;
  } else if (y >= this.DIM_Y) {
    y = this.DIM_Y;
  } else if (y <= 0) {
    y = 0;
  }
  return [x, y];
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
};

module.exports = Game;
