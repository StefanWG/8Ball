class BallRack {
    constructor(left) {
        this.balls = [];
        this.y = TABLESIZE/2*1.28 + 30
        this.width = ballRadius*2*9.5;
        this.height = ballRadius*3;

        if (left) {
            this.x = TABLESIZE*0.07 + TABLESIZE*0.18;
        } else {
            this.x = TABLESIZE*1.07 - TABLESIZE*0.18 - this.width;
        }
    }

    addBall(ball) {
        this.balls.push(ball);
    }

    getSVGGroup() {
        let group = document.createElementNS("http://www.w3.org/2000/svg","g");
        let rack = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rack.setAttribute("x", `${this.x}px`);
        rack.setAttribute("y", `${this.y}px`);
        rack.setAttribute("width", `${this.width}px`);
        rack.setAttribute("height", `${this.height}px`);

        group.appendChild(rack);

        for (let i = 0; i < 7; i++) {
            if (i >= this.balls.length) {
                let startPoint = this.x + (this.width - ballRadius*2*7 - 5*6)/2 + ballRadius;
                let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", `${startPoint+ ballRadius*2*i + i*5}px`);
                circle.setAttribute("cy", `${this.y + ballRadius*1.5}px`);
                circle.setAttribute("r", `${ballRadius}px`);
                circle.setAttribute("fill", "white");
                group.appendChild(circle);
            } else {
                //TODO: Draw ball
                console.log(this.balls[i]);
            }
        }

        // for (let ball of this.balls) {
        //     rack.appendChild(ball.getSVGGroup());
        // }
        return group;
    }
}