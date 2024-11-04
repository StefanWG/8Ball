function draw() {
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
    drawBorders();
    drawFelt();
    drawPockets();
    for(const b of balls) { b.draw() }

    if (state == "ANGLE" || state == "SETUP") {
        let group = cueStick.getSVGGroup();
        svg.appendChild(group);
        let powerBarGroup = cueStick.powerBar.getSVGGroup();
        svg.appendChild(powerBarGroup);
    }
}

function drawBorders() {
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

    // Add curve to table corners
    let curve = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    curve.setAttribute("width", `${TABLESIZE*1.14}px`);
    curve.setAttribute("height", `${TABLESIZE/2*1.28}px`);
    curve.setAttribute("fill-opacity", "0");
    curve.setAttribute("stroke", "white");
    curve.setAttribute("stroke-width", "25");
    curve.setAttribute("rx", "30");
    svg.appendChild(curve);
}

function drawPockets() {
    for (let i = 0; i < pocketsXY.length; i++){
        let pocket = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pocket.setAttribute("cx", `${pocketsXY[i][0]}px`);
        pocket.setAttribute("cy", `${pocketsXY[i][1]}px`);
        pocket.setAttribute("r", `${pocketRadius}px`);
        pocket.setAttribute("fill", "url(#Pocket)")
        svg.appendChild(pocket);
        pockets.push(pocket)
    }
}

function drawFelt() {
    let felt = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    felt.setAttribute("width", `${TABLESIZE}px`);
    felt.setAttribute("height", `${TABLESIZE/2}px`);
    felt.setAttribute("fill", "url(#FeltGradient)");
    felt.setAttribute("x", `${TABLESIZE*0.07}px`);
    felt.setAttribute("y", `${TABLESIZE/2*.14}px`);
    svg.appendChild(felt);
}