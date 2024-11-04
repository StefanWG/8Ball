function addBall(x, y, drawBallBelow, iters, level) {
    let ballColors = ["yellow", "blue", "red", "purple", "orange", "darkgreen", "maroon", "black"];
    let ballOrder = [1, 3, 13, 2, 7, 10, 8, 15, 12, 6, 4, 5, 9, 11, 14]; // TODO: Randomize this?


    let i = balls.length;
    let number = ballOrder[i];

    let ball = new Ball(x,y,ballRadius, 0,0, number, ballColors[(number-1) % 8])
    balls.push(ball);
    let levelOffset = .6;
    if (iters > 0) {
        addBall(x+ballRadius*Math.sqrt(4), y-ballRadius-levelOffset*level, false, iters-1, level +1);
        
        if (drawBallBelow) {
            addBall(x+ballRadius*Math.sqrt(4), y+ballRadius+levelOffset*level, true, iters-1, level+1);
        }
    }
}

function addCueAnimationEndListener(cueStick) {
    cueStick.group.addEventListener("animationend", function(e) {
    console.log("HERE");
    let speed = cueStick.strength * 5;
    let direction = cueStick.direction;
    setVelocityVector(cueBall, speed, direction);

    document.getElementById("cueStick").remove();

    ballMoveIntervalId = setInterval(function() {
        mainLoop();
    }, 1000/FPS);
    });
}

function setVelocityVector(ball, speed, direction) {
    ball.vx = speed * Math.cos(direction);
    ball.vy = speed * Math.sin(direction);
}

function create() {
    lines.push(new Line(TABLESIZE*0.07,TABLESIZE/2*0.14,TABLESIZE*1.07,TABLESIZE/2*0.14)); // Top
    lines.push(new Line(TABLESIZE*1.07,TABLESIZE/2*1.14,TABLESIZE*0.07,TABLESIZE/2*1.14)); // Bottom
    lines.push(new Line(TABLESIZE*0.07,TABLESIZE/2*1.14,TABLESIZE*0.07,TABLESIZE/2*0.14)); // Left
    lines.push(new Line(TABLESIZE*1.07,TABLESIZE/2*0.14,TABLESIZE*1.07,TABLESIZE/2*1.14)); // Right
    addBall(frontBallX, frontBallY, 1, 4, 1);
    cueStick = new CueStick(TABLESIZE/10*3, TABLESIZE/4+TABLESIZE*0.07, ballRadius);
    cueBall = new Ball(TABLESIZE/10*3, TABLESIZE/4+TABLESIZE*0.07, ballRadius, 0,0);
    balls.push(cueBall);

    svg.addEventListener("mousemove", function(e) {
        cueStick.updateAngle(e.clientX - rect.left, e.clientY - rect.top);
        cueStick.powerUp(e.clientX - rect.left, e.clientY - rect.top, false);
    });
    
    svg.addEventListener("mousedown", function(e) {
        state = "POWER";
        cueStick.power()
        cueStick.powerUp(e.clientX - rect.left, e.clientY - rect.top, true);
    });
    
    svg.addEventListener("mouseup", function(e) {
        state = "SHOOTING";
        cueStick.shooting()
    });

    draw();
    addCueAnimationEndListener(cueStick);

}

function mainLoop() {
    resolveCollisions();
    let anothermove = false;
    for(const b of balls) { 
        b.update() 
        if (b.vx > 0 || b.vy > 0) {
            anothermove = true;
        }
    }
    draw();

    if (!anothermove) {
        clearInterval(ballMoveIntervalId);
        cueStick = new CueStick(cueBall.x, cueBall.y, ballRadius);
        state = "ANGLE";
        draw();
        addCueAnimationEndListener(cueStick);
        return;
    }


}