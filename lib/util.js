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

module.exports = Util;
