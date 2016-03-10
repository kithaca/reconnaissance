/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameView = __webpack_require__(1);
	var Game = __webpack_require__(2);

	var canvas = document.getElementById('canvas');
	canvas.width = 1300;
	canvas.height = 800;

	var ctx = canvas.getContext('2d');

	var g = new GameView(new Game(), ctx);

	g.start();


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Player = __webpack_require__(3);
	var Enemy = __webpack_require__(6);
	var MovingObject = __webpack_require__(5);
	var EnemyPlayer = __webpack_require__(7);

	var Game = function () {
	  this.DIM_X = 1300;
	  this.DIM_Y = 800;
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
	  return {
	    type: "base",
	    x: 100,
	    y: 100,
	    width: 30,
	    height: 30,
	    color: "cornflowerblue"
	  };
	};

	Game.prototype.addEnemyBase = function () {
	  return {
	    type: "base",
	    x: this.DIM_X - 130,
	    y: this.DIM_Y - 130,
	    width: 30,
	    height: 30,
	    color: "mediumseagreen"
	  };
	};

	Game.prototype.addObstacles = function () {
	  var game = this;
	  return [
	    {
	      type: "obstacle",
	      x: 180,
	      y: 100,
	      width: 20,
	      height: 80,
	      color: "sienna"
	    },

	    {
	      type: "obstacle",
	      x: 100,
	      y: 180,
	      width: 100,
	      height: 20,
	      color: "sienna"
	    },

	    {
	      type: "obstacle",
	      x: game.DIM_X - 200,
	      y: game.DIM_Y - 200,
	      width: 100,
	      height: 20,
	      color: "sienna"
	    },

	    {
	      type: "obstacle",
	      x: game.DIM_X - 200,
	      y: game.DIM_Y - 200,
	      width: 20,
	      height: 100,
	      color: "sienna"
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
	    x: game.enemyBase.x + 10,
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
	    if (obj.type === "obstacle" || obj.type === "base") {
	      ctx.fillStyle = obj.color;
	      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
	    } else if (obj.type === "flag") {
	      if (!that.flagCaptured) {
	        ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
	      } else {
	        ctx.drawImage(obj.img, that.player.pos[0], that.player.pos[1], obj.width, obj.height);
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);

	var Player = function(pos, game) {
	  this.vel = [0, 0];
	  this.color = "blue";
	  this.radius = 10;
	  this.pos = pos;
	  this.game = game;
	  this.type = "moving";
	  this.maxVel = 7;
	};

	Util.inherits(Player, MovingObject);

	Player.prototype.relocate = function () {
	  this.pos = [this.game.homeBase.x, this.game.homeBase.y];
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
	  // debugger;
	  var base = {};
	  var radius = this.game.enemyBase.width;
	  base.pos = [this.game.enemyBase.x + radius, this.game.enemyBase.y + radius];

	  if (this.distance(base) < this.game.enemyBase.width) {
	    this.game.flagCaptured = true;
	  }
	};

	Player.prototype.flagDelivered = function () {
	  var base = {};
	  var radius = this.game.homeBase.width;
	  base.pos = [this.game.homeBase.x + radius, this.game.homeBase.y + radius];

	  if (this.distance(base) < this.game.homeBase.width + this.radius) {
	    return true;
	  } else {
	    return false;
	  }
	};



	module.exports = Player;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Util = function () {};

	Util.inherits = function (ChildClass, SuperClass) {
	  function Surrogate () {}
	  Surrogate.prototype = SuperClass.prototype;
	  ChildClass.prototype = new Surrogate();
	  ChildClass.prototype.constructor = ChildClass;
	};

	Util.randomVec = function (length) {
	  var x = Math.random() * length;
	  var y = Math.sqrt((length * length) - (x * x));
	  var coordinates = [x, y];
	  return coordinates.map(function (el) {
	    var tempX = Math.random();
	    if (tempX < 0.5) {
	      return (el * -1);
	    } else {
	      return (el);
	    }
	  });
	};

	Util.velocity = function (vel) {
	  var x = vel[0];
	  var y = vel[1];

	  return Math.sqrt(x * x + y * y);
	};

	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);

	var MovingObject = function (options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = 100; //options.radius;
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

	    if ((x + that.radius) >= xBounds[0] && (x - that.radius) <= xBounds[1] &&
	        (y + that.radius) >= yBounds[0] && (y - that.radius) <= yBounds[1]) {

	      velX *= -1;
	      velY *= -1;
	    }

	  });
	  return [[x, y], [velX, velY]];

	};

	MovingObject.prototype.dampen = function () {
	  this.vel[0] *= 0.98;
	  this.vel[1] *= 0.98;
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
	      } else {
	        obj.vel[0] *= -1;
	        obj.vel[1] *= -1;
	        obj.pos[0] += obj.vel[0];
	        obj.pos[1] += obj.vel[1];
	        that.vel[0] *= -1;
	        that.vel[1] *= -1;
	        that.pos[0] += that.vel[0];
	        that.pos[1] += that.vel[1];
	      }
	    }
	  });

	};

	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);
	var Player = __webpack_require__(3);

	var Enemy = function(pos, game) {
	  this.type = "enemy";
	  this.vel = Util.randomVec(2);
	  this.color = "green";
	  this.radius = 10;
	  this.pos = pos;
	  this.game = game;
	  this.type = "moving";
	  this.maxVel = 2;
	  this.goal = this.generateDestination();
	};

	Util.inherits(Enemy, MovingObject);

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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	var MovingObject = __webpack_require__(5);

	var EnemyPlayer = function(pos, game) {
	  this.vel = [0, 0];
	  this.color = "purple";
	  this.radius = 10;
	  this.pos = pos;
	  this.game = game;
	  this.type = "moving";
	  this.maxVel = 6;
	};

	EnemyPlayer.prototype.getFlag = function () {
	  // debugger;
	  var base = {};
	  var radius = this.game.enemyBase.width;
	  base.pos = [this.game.enemyBase.x + radius, this.game.enemyBase.y + radius];

	  if (this.distance(base) < this.game.enemyBase.width) {
	    this.game.homeFlagCaptured = true;
	  }
	};

	Util.inherits(EnemyPlayer, MovingObject);

	module.exports = EnemyPlayer;


/***/ }
/******/ ]);