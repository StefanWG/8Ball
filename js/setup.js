let TABLESIZE = 600;
let frontBallX = TABLESIZE/6*5;
let frontBallY = TABLESIZE/4+ TABLESIZE/2*.14;
let ballRadius = TABLESIZE/(100/1.125);
let pocketRadius = TABLESIZE/(100/2.25)

let state = "SETUP";
const svg = document.getElementById("svg");
const rect = svg.getBoundingClientRect();

const MAXPOWER = 120;
const FPS = 60;
const FRICTION = 0.997;
const WALL_LOSS = 1;


let cueStick = null;
let cueBall = null;
let ballMoveIntervalId = null;

let pockets = [];
let pocketsXY = [[TABLESIZE*0.07, TABLESIZE/2*.14], 
                [TABLESIZE*0.57, TABLESIZE/2*.14], 
                [TABLESIZE*1.07, TABLESIZE/2*.14], 
                [TABLESIZE*0.07, TABLESIZE/2*1.14], 
                [TABLESIZE*0.57, TABLESIZE/2*1.14], 
                [TABLESIZE*1.07, TABLESIZE/2*1.14]];


const balls = [];
const lines = [];
    
create();
console.log(balls);