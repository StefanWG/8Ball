// let TABLESIZE = 600;
// let FPS = 60;
let svg = document.getElementById("svg");

let edges = {"top": 0, "bottom": TABLESIZE, "left": 0, "right": TABLESIZE};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

let numBalls = 10;
let ballRadius = 10;
let balls = [];
for (let i = 0; i < numBalls; i++) {
    let ball = new Ball(Math.random()*(TABLESIZE-ballRadius*2) + ballRadius, 
                        Math.random()*(TABLESIZE-ballRadius*2) + ballRadius, ballRadius);
    ball.color = getRandomColor();
    ball.speed = Math.random();
    ball.direction = Math.random()*2*Math.PI - Math.PI;
    balls.push(ball);
}

function drawBalls() {
    // Reset
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", `600px`);
    rect.setAttribute("height", `600px`);
    svg.appendChild(rect);

    for (let ball of balls) {
        let group = ball.getSVGGroup();
        svg.appendChild(group);
    }
} 

function anim() {
    resolveCollisions();
    for(const b of balls) { b.move(FPS) }
    drawBalls();
}

anim();

setInterval(anim, 1000/FPS);