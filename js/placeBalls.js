let TABLESIZE = 800;
let frontBallX = TABLESIZE/6*5;
let frontBallY = TABLESIZE/4+ TABLESIZE/2*.14;
let ballRadius = TABLESIZE/(100/1.125);
let pocketRadius = TABLESIZE/(100/2.25)

let edges = {"top": TABLESIZE/2*.14, "bottom": TABLESIZE/2*1.14, "left": TABLESIZE*0.07, "right": TABLESIZE*1.07};
let balls = [];
let ballColors = ["yellow", "blue", "red", "purple", "orange", "darkgreen", "maroon", "black"];
let ballOrder = [1, 3, 13, 2, 7, 10, 8, 15, 12, 6, 4, 5, 9, 11, 14]; // TODO: Randomize this?
let FPS = 100;

let MAXPOWER = 120;

let pockets = [];
let pocketsXY = [[TABLESIZE*0.07, TABLESIZE/2*.14], 
                [TABLESIZE*0.57, TABLESIZE/2*.14], 
                [TABLESIZE*1.07, TABLESIZE/2*.14], 
                [TABLESIZE*0.07, TABLESIZE/2*1.14], 
                [TABLESIZE*0.57, TABLESIZE/2*1.14], 
                [TABLESIZE*1.07, TABLESIZE/2*1.14]];

let state = "SETUP";
let svg = document.getElementById("table");
const rect = svg.getBoundingClientRect();

addBall(frontBallX, frontBallY, true, 0);
let cueBall = new CueBall(TABLESIZE/10*3, TABLESIZE/4+TABLESIZE*0.07, ballRadius);
balls.push(cueBall);

let cueStick = new CueStick(TABLESIZE/10*3, TABLESIZE/4+TABLESIZE*0.07, ballRadius);

let ballRackSolids = new BallRack(true);
let ballRackStripes = new BallRack(false);

let ballRacks = [ballRackSolids, ballRackStripes];

draw(balls, cueStick, ballRacks);
state = "ANGLE";

// Add listeners
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

addCueAnimationEndListener(cueStick);
