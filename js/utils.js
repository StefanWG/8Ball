function draw(balls, cueStick) {
    // Reset
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

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

    for (let i = 0; i < pocketsXY.length; i++){
        let pocket = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pocket.setAttribute("cx", `${pocketsXY[i][0]}px`);
        pocket.setAttribute("cy", `${pocketsXY[i][1]}px`);
        pocket.setAttribute("r", `${pocketRadius}px`);
        svg.appendChild(pocket);
        pockets.push(pocket)
    }

    for (let ball of balls) {
        let group = ball.getSVGGroup();
        svg.appendChild(group);
    }

    // Draw Cue Stick - change depending on states
    if (state == "ANGLE" || state == "SETUP") {
        let group = cueStick.getSVGGroup();
        svg.appendChild(group);
        let powerBarGroup = cueStick.powerBar.getSVGGroup();
        svg.appendChild(powerBarGroup);
    }

}

function addBall(x, y, drawBallBelow, iters) {
    let i = balls.length;

    let ball = new NumberedBall(x,y,ballRadius, i)
    balls.push(ball);
    if (iters > 0) {
        addBall(x+ballRadius*Math.sqrt(3), y-ballRadius, false, iters-1);
        
        if (drawBallBelow) {
            addBall(x+ballRadius*Math.sqrt(3), y+ballRadius, true, iters-1);
        }
    }
}

function addCueAnimationEndListener(cue) {
    cue.group.addEventListener("animationend", function(e) {
        console.log("ready to move balls");
        console.log(cue);
        cueBall.speed = cue.strength * MAXPOWER;
        cueBall.direction = cue.direction;
    
        document.getElementById("cueStick").remove();
    
        ballMoveIntervalId = setInterval(function() {
            updateBalls(FPS);
        }, 1000/FPS);
        console.log(ballMoveIntervalId);
    });
}

function updateBalls(FPS) {
    /*
        Order of operations:
        1. Move balls
        2. Check for collisions
        3. Check for pockets
        4. Friction
        5. Draw
    */
    let anotherMove = false;
    for (let ball of balls) {
        if (ball.move(FPS)) {
            anotherMove = true;
        }
        ball.fallInPocket();
        // if (ball.fallInPocket()) {
        //     clearInterval(ballMoveIntervalId);
        //     return;
        // }
        ball.findCollisions(balls);
        ball.friction();
    }
    draw(balls, cueStick);

    if (!anotherMove) {
        clearInterval(ballMoveIntervalId);
        cueStick = new CueStick(cueBall.x, cueBall.y, ballRadius);
        state = "ANGLE";
        draw(balls, cueStick);
        addCueAnimationEndListener(cueStick);
        return;
    }
}
