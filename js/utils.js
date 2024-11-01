function draw(balls, cueStick, ballRacks) {
    // Reset
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
    // TODO: Put white polygon on top to curve the edges of table
    // TODO: Replicate this table: https://media.istockphoto.com/id/1128385782/photo/billiard-table-isolated.jpg?s=612x612&w=0&k=20&c=LDdHJR2prRKFldGiABhhNkHnixyGdgr7ZbUpfyjhyL0=
    //Add border - top
    let polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    svg.appendChild(polygon);
    
    var array = arr = [ [ 0,0 ], 
                [ TABLESIZE*1.14,0 ],
                [ TABLESIZE*1.07,TABLESIZE/2*0.14 ],
                [ TABLESIZE*0.07, TABLESIZE/2*0.14] ];
    
    for (value of array) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        polygon.points.appendItem(point);
    }
    polygon.setAttribute("fill", "url(#BorderTop)");

    // Add border - bottom
    polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    svg.appendChild(polygon);
    
    var array = arr = [ [ 0,TABLESIZE/2*1.28 ], 
                [ TABLESIZE*0.07,TABLESIZE/2*1.14 ],
                [ TABLESIZE*1.07,TABLESIZE/2*1.14 ],
                [ TABLESIZE*1.14, TABLESIZE/2*1.28] ];
    
    for (value of array) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        polygon.points.appendItem(point);
    }
    polygon.setAttribute("fill", "url(#BorderBottom)");

    //Add border - left
    polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    svg.appendChild(polygon);
    
    var array = arr = [ [ 0,0 ], 
                [ TABLESIZE*0.07, TABLESIZE/2*0.14],
                [TABLESIZE*0.07, TABLESIZE/2*1.14 ],
                [0, TABLESIZE/2*1.28] ];
    
    for (value of array) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        polygon.points.appendItem(point);
    }
    polygon.setAttribute("fill", "url(#BorderLeft)");

    //Add border - right
    polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    svg.appendChild(polygon);
    
    var array = arr = [ [ TABLESIZE*1.14,0 ], 
                [ TABLESIZE*1.14, TABLESIZE/2*1.28],
                [TABLESIZE*1.07, TABLESIZE/2*1.14 ],
                [TABLESIZE*1.07, TABLESIZE/2*0.14] ];
    
    for (value of array) {
        var point = svg.createSVGPoint();
        point.x = value[0];
        point.y = value[1];
        polygon.points.appendItem(point);
    }
    polygon.setAttribute("fill", "url(#BorderRight)");

    //Add Felt
    let felt = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    felt.setAttribute("width", `${TABLESIZE}px`);
    felt.setAttribute("height", `${TABLESIZE/2}px`);
    felt.setAttribute("fill", "url(#FeltGradient)");
    felt.setAttribute("x", `${TABLESIZE*0.07}px`);
    felt.setAttribute("y", `${TABLESIZE/2*.14}px`);
    svg.appendChild(felt);

    // Add pockets

    for (let i = 0; i < pocketsXY.length; i++){
        let pocket = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pocket.setAttribute("cx", `${pocketsXY[i][0]}px`);
        pocket.setAttribute("cy", `${pocketsXY[i][1]}px`);
        pocket.setAttribute("r", `${pocketRadius}px`);
        pocket.setAttribute("fill", "url(#Pocket)")
        svg.appendChild(pocket);
        pockets.push(pocket)
    }

    for (let ball of balls) {
        let group = ball.getSVGGroup();
        svg.appendChild(group);
    }

    //Draw ball racks
    for (let ballRack of ballRacks) {
        let group = ballRack.getSVGGroup();
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

    if (!anotherMove) {
        clearInterval(ballMoveIntervalId);
        cueStick = new CueStick(cueBall.x, cueBall.y, ballRadius);
        state = "ANGLE";
        draw(balls, cueStick, ballRacks);
        addCueAnimationEndListener(cueStick);
        return;
    }
    draw(balls, cueStick, ballRacks);
}
