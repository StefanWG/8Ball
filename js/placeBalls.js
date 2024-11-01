let TABLESIZE = 800;

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
addBallSvg(frontBallX, frontBallY, true, 4);

// Add Cue Ball and Stick
let cueBall = new CueBall(TABLESIZE/10*3, TABLESIZE/4+TABLESIZE*0.07, ballRadius, svg);
balls.push(cueBall);

let cue = new CueStick(TABLESIZE/10*3, TABLESIZE/4+TABLESIZE*0.07, ballRadius, svg)

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

function updateBalls() {
    // While at least one ball has speed > 0, continue updating

    // Shift each ball based on speed and direction, and resolve any collisions
    // Collisions with ball that is touch other ball shall be hard
    // May have to compute math for many more frames, but only update visual 60 fps

    // ORDER MOVE all balls, check for collisions, resolve collisions and update speed and direction, 
    // update speed for frication
    //CHECK IN POCKET AT SOME POINT
}