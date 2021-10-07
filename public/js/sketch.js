let socket;
let closeButton, screenButton, colorButton, linkButton;
let canvasIMG, updatedCanvas;

function setup() {
  colorMode(HSB, 2*PI, 1, 1, 255);
  createCanvas(600, 600);
}

var y = 25;
var vel = 0;

var balls = [];

function draw() {

  if (frameCount % 10 == 0) {
    const accelerationDirection = random()*2*PI;
    const aX = cos(accelerationDirection);
    const aY = sin(accelerationDirection);
    balls.push(new Ball(new createVector(random()*width, random()*height), new createVector(aX,aY)));
  }

  balls.forEach(function(ball) {
    ball.updatePosition();
    ball.updateVelocity();
    ball.drawBall();
    ball.updateOpacity();
    if (ball.getIsDead()) {
      balls.splice(ball,1);
    }
  });

  drawBackground();
}

function drawBackground() {

  fill(0,0,1,90);
  stroke(0,0,1,0);
  rect(0, 0, width, height);

}

class Ball {

  constructor(initialPosition, acceleration) {
    this.position = initialPosition;
    this.acceleration = acceleration;
    this.velocity = new createVector(0,0);
    this.opacity = 0;
    this.decaying = false;
    this.isDead = false;
  }

  getIsDead() {
    return this.isDead;
  }

  updatePosition() {
    this.position = this.position.add(this.velocity);
  }

  updateVelocity() {
    this.velocity = p5.Vector.add(this.velocity, this.acceleration)
    this.velocity = p5.Vector.add(this.velocity, p5.Vector.mult(this.velocity, -0.01));
    if ((this.position.x < 0 && this.velocity.x < 0) || (this.position.x > width && this.velocity.x > 0) ) {
      this.velocity.x = -this.velocity.x;
    }
     if ((this.position.y < 0 && this.velocity.y < 0) || (this.position.y > height && this.velocity.y > 0) ) {
      this.velocity.y = -this.velocity.y;
    }
  }

  updateOpacity() {
    if (this.decaying) {
      this.opacity = this.opacity - 2;
    } else {
      this.opacity = this.opacity + 2
    }
    if (!this.decaying && this.opacity > 200) {
      this.decaying = true;
    }
    if (this.opacity < 0 && !this.isDead) {
      this.isDead = true;
    }
  }

  drawBall() {
    const x = this.position.x;
    const y = this.position.y;
    strokeWeight(50);
    stroke(color(2*PI*y/height, 0.5, 0.8, this.opacity))
    point(x,y);
  }

}