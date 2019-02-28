// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

window.onresize = function() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

var para = document.querySelector('p');

function random(min, max) {
  var num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

function Shape(x, y) {
  this.x = x;
  this.y = y;
}

function Ball(x, y, velX, velY, color, size) {
  Shape.call(this, x, y, velX, velY);
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
  this.exists = true;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

function Circle(x, y) {
  Shape.call(this, x, y);
  this.velX = 20;
  this.velY = 20;
  this.color = 'yellow';
  this.size = 10;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

var startDrawCircle = 0.15 * Math.PI;
var endDrawCircle = 1.85 * Math.PI;

Circle.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, startDrawCircle, endDrawCircle);
  ctx.lineTo(this.x, this.y);
  ctx.fill();
};

Circle.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
    if (e.keyCode === 65) {
      _this.x -= _this.velX;
      startDrawCircle = 1.15 * Math.PI;
      endDrawCircle = 0.85 * Math.PI;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
      startDrawCircle = 0.15 * Math.PI;
      endDrawCircle = 1.85 * Math.PI;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
      startDrawCircle = 1.65 * Math.PI;
      endDrawCircle = 1.35 * Math.PI;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
      startDrawCircle = 0.65 * Math.PI;
      endDrawCircle = 0.35 * Math.PI;
    }
  }
};

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

Circle.prototype.checkBounds = function() {
  if ((this.x + this.size) >= width) {
    this.x = -(width - this.x);
  }

  if ((this.x - this.size) <= 0) {
    this.x = width - this.x;
  }

  if ((this.y + this.size) >= height) {
    this.y = -(height - this.y);
  }

  if ((this.y - this.size) <= 0) {
    this.y = height - this.y;
  }
};

Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j]) && balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
      }
    }
  }
};

var scores = 0;

Circle.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        scores++;
        para.textContent = 'Scores: ' + scores;
      }
    }
  }
};

// define array to store balls

var balls = [];
while (balls.length < 10) {
  var ball = new Ball(
    random(0, width),
    random(0, height),
    random(-7, 7),
    random(-7, 7),
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
    random(10, 20)
  );
  balls.push(ball);
}

var circle = new Circle(random(0, width), random(0, height));
circle.setControls();

// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  for (var i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  circle.draw();
  circle.checkBounds();
  circle.collisionDetect();

  requestAnimationFrame(loop);
}

loop();
