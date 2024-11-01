let TABLESIZE = 800;
let ballMoveIntervalId = null;
let FPS = 1000;

let edges = {"top": TABLESIZE/2*.14, "bottom": TABLESIZE/2*1.14, "left": TABLESIZE*0.07, "right": TABLESIZE*1.07};

let svg = document.getElementById('table');
const rect = svg.getBoundingClientRect();

//Add border
let border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
border.setAttribute("width", `${TABLESIZE*1.14}px`);
border.setAttribute("height", `${TABLESIZE/2*1.28}px`);
border.setAttribute("fill", "gray");
border.setAttribute("rx", `${TABLESIZE/20}px`);
svg.appendChild(border);

//Add Felt
let felt = document.createElementNS("http://www.w3.org/2000/svg", "rect");
felt.setAttribute("width", `${TABLESIZE}px`);
felt.setAttribute("height", `${TABLESIZE/2}px`);
felt.setAttribute("fill", "green");
felt.setAttribute("x", `${TABLESIZE*0.07}px`);
felt.setAttribute("y", `${TABLESIZE/2*.14}px`);
svg.appendChild(felt);

// Add pockets
let pockets = [];
let pocketsXY = [[TABLESIZE*0.07, TABLESIZE/2*.14], 
                [TABLESIZE/2, TABLESIZE/2*.14], 
                [TABLESIZE*1.07, TABLESIZE/2*.14], 
                [TABLESIZE*0.07, TABLESIZE/2*1.14], 
                [TABLESIZE/2, TABLESIZE/2*1.14], 
                [TABLESIZE*1.07, TABLESIZE/2*1.14]];

console.log(pocketsXY);

for (let i = 0; i < pocketsXY.length; i++){
    let pocket = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pocket.setAttribute("cx", `${pocketsXY[i][0]}px`);
    pocket.setAttribute("cy", `${pocketsXY[i][1]}px`);
    pocket.setAttribute("r", `${TABLESIZE/(100/2.25)}px`);
    svg.appendChild(pocket);
    pockets.push(pocket)
}

// Add Numbered Balls
let frontBallX = TABLESIZE/6*5;
let frontBallY = TABLESIZE/4+ TABLESIZE/2*.14;
let ballRadius = TABLESIZE/(100/1.125);

let balls = [];

function addBallSvg(x, y, drawBallBelow, iters) {
    let i = balls.length;

    let ball = new NumberedBall(x,y,ballRadius, i, svg)
    balls.push(ball);
    if (iters > 0) {
        addBallSvg(x+ballRadius*Math.sqrt(3), y-ballRadius, false, iters-1);
        
        if (drawBallBelow) {
            addBallSvg(x+ballRadius*Math.sqrt(3), y+ballRadius, true, iters-1);
        }
    }
}

let ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
addBallSvg(frontBallX, frontBallY, true, 0);

// Add Cue Ball and Stick
let cueBall = new CueBall(TABLESIZE/10*3, TABLESIZE/4+TABLESIZE*0.07, ballRadius, svg);
balls.push(cueBall);

let cue = new CueStick(TABLESIZE/10*3, TABLESIZE/4+TABLESIZE*0.07, ballRadius, svg)
addCueAnimationEndListener(cue);

// Add Event Listeners
svg.addEventListener("mousemove", function(e) {
    cue.updateAngle(e.clientX - rect.left, e.clientY - rect.top);
    cue.powerUp(e.clientX - rect.left, e.clientY - rect.top, false);
});

svg.addEventListener("mousedown", function(e) {
    cue.power()
    cue.powerUp(e.clientX - rect.left, e.clientY - rect.top, true);
});

svg.addEventListener("mouseup", function(e) {
    cue.shooting()
});

function addCueAnimationEndListener(cue) {
    cue.group.addEventListener("animationend", function(e) {
        console.log("ready to move balls");
        console.log(cue);
        cueBall.speed = 200;
        console.log("HERE")
        cueBall.direction = cue.direction;
        console.log("here")
    
        document.getElementById("cueStick").remove();
    
        ballMoveIntervalId = setInterval(function() {
            updateBalls(FPS);
        }, 1000/FPS);
        console.log(ballMoveIntervalId);
    });
}



function updateBalls(FPS) {
    console.log("in updating balls");
    let toMove = false;
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].speed > 0) {
            toMove = true;
            break
        }
    }
    if (!toMove) {
        clearInterval(ballMoveIntervalId);
        cue = new CueStick(cueBall.x, cueBall.y, ballRadius, svg)
        addCueAnimationEndListener(cue);
        return;
    }
    for (let i = 0; i < balls.length; i++) {
        balls[i].move(FPS);
        balls[i].fallInPocket();
        balls[i].findCollisions(balls);
        balls[i].friction();
    }
    // While at least one ball has speed > 0, continue updating

    // Shift each ball based on speed and direction, and resolve any collisions
    // Collisions with ball that is touch other ball shall be hard
    // May have to compute math for many more frames, but only update visual 60 fps

    // ORDER MOVE all balls, check for collisions, resolve collisions and update speed and direction, 
    // update speed for frication
    //CHECK IN POCKET AT SOME POINT
}