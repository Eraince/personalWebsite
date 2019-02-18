$(document).ready(function() {
  console.log("ready");
});

// ------------------------------P5----------------------------------------------------

class Rectangle {
  constructor(r, g, b, rating) {
    this.x = (windowWidth / 12) * (rating - 1) + 100;
    this.y = windowHeight / 3;
    this.r = r;
    this.g = g;
    this.b = b;
    this.rating = rating;
  }

  draw() {
    var c = color(this.r, this.g, this.b);
    noStroke();
    fill(c);
    rect(this.x, this.y, 50, 50);
  }

  hits(mouseX, mouseY) {
    if (
      mouseX > this.x &&
      mouseX < this.x + 50 &&
      mouseY > this.y &&
      mouseY < this.y + 50
    ) {
      return true;
    }
    return false;
  }
}

var rects = [];
var dragRec;
var isDragging;
var clickOffsetX;
var clickOffsetY;

function preload() {}

function setup() {
  placeImages();

  isDragging = false;

  var canvas = createCanvas((windowWidth / 3) * 2, windowHeight / 2);
  canvas.parent("game");
}

function placeImages() {
  var rect0 = new Rectangle(255, 0, 0, 1);
  var rect1 = new Rectangle(0, 0, 255, 2);
  var rect2 = new Rectangle(0, 255, 0, 3);
  var rect3 = new Rectangle(255, 255, 0, 4);
  var rect4 = new Rectangle(0, 255, 255, 5);
  var rect5 = new Rectangle(255, 0, 255, 6);

  rects.push(rect0);
  rects.push(rect1);
  rects.push(rect2);
  rects.push(rect3);
  rects.push(rect4);
  rects.push(rect5);
}

function draw() {
  clear();
  textSize(20);
  fill(255, 255, 255);
  text("Favorite", 40, 40);

  textSize(20);
  fill(255, 255, 255);
  text("Least Favorite", width - 250, 40);
  line(0, 100, 300, 40);
  stroke(255, 0, 0);
  rects.forEach(r => r.draw());
}

function mousePressed() {
  var index;
  rects.forEach((r, i) => {
    if (r.hits(mouseX, mouseY)) {
      clickOffsetX = r.x - mouseX;
      clickOffsetY = r.y - mouseY;
      isDragging = true;
      dragRec = r;
      index = i;
    }
  });
  if (isDragging) {
    putOnTop(index);
  }
}

function putOnTop(index) {
  rects.splice(index, 1);
  rects.push(dragRec);
}

function mouseDragged() {
  if (isDragging) {
    let m = createVector(mouseX, mouseY);
    dragRec.x = mouseX + clickOffsetX;
    dragRec.y = mouseY + clickOffsetY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth / 2, windowHeight / 2);
}

function keyPressed() {
  updateOrder();
  updateColor();
  calMean();
  devCal();
  // console.log(redDev);
  $("#red-data").html(
    "<p style='font-size:1.5em'>" + floor(redDev) + " deviated from</p> "
  );
  $("#green-data").html(
    "<p style='font-size:1.5em'>" + floor(greenDev) + " deviated from</p> "
  );
  $("#blue-data").html(
    "<p style='font-size:1.5em'>" + floor(blueDev) + " deviated from</p> "
  );
}

function updateOrder() {
  rects.sort(function(a, b) {
    return a.x - b.x;
  });
  for (var i = 0; i < 6; i++) {
    rects[i].rating = i + 1;
  }
}

function updateColor() {
  var best;
  for (var i = 0; i < 6; i++) {
    if (rects[i].rating == 1) {
      best = rects[i];
    }
  }
  for (i = 0; i < 6; i++) {
    calculateColor(best, rects[i], rects[i].rating, i);
  }
}

function calculateColor(best, current, rating, i) {
  var red = calculateDiff(best.r, current.r, rating);
  var green = calculateDiff(best.g, current.g, rating);
  var blue = calculateDiff(best.b, current.b, rating);
  rects[i].r = red;
  rects[i].g = green;
  rects[i].b = blue;
}

function calculateDiff(target, change, rating) {
  var diff = 0;
  if (target > change) {
    diff = (target - change) * 0.05 * (rating - 1);
    return change + diff;
  } else if (target == change) {
    return change;
  } else {
    diff = (change - target) * 0.05 * (rating - 1);
    return change - diff;
  }
}

var redMean = 0;
var greenMean = 0;
var blueMean = 0;
var redDev = 0;
var greenDev = 0;
var blueDev = 0;

function devCal() {
  redDev = 0;
  greenDev = 0;
  blueDev = 0;
  for (var i = 0; i < 6; i++) {
    redDev = redDev + (rects[i].r - redMean) * (rects[i].r - redMean);
    greenDev += (rects[i].g - greenMean) * (rects[i].g - greenMean);
    blueDev += (rects[i].b - blueMean) * (rects[i].b - blueMean);
  }
  redDev = Math.sqrt(redDev / 6);

  greenDev = Math.sqrt(greenDev / 6);
  blueDev = Math.sqrt(blueDev / 6);
}

function calMean() {
  redMean = 0;
  greenMean = 0;
  blueMean = 0;
  for (var i = 0; i < 6; i++) {
    redMean += rects[i].r;
    blueMean += rects[i].b;
    greenMean += rects[i].g;
  }

  redMean /= 6;
  blueMean /= 6;
  greenMean /= 6;
}
