let ballColors = ["yellow", "blue", "red", "purple", "orange", "darkgreen", "maroon", "black"];
let ballOrder = [1, 3, 13, 2, 7, 10, 8, 15, 12, 6, 4, 5, 9, 11, 14]; // TODO: Randomize this?

let FPS = 60;

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 0; // in inches (pixels) per second
        this.direction = 0; // in radians
    }

    move() {
        // Move the cue ball

    } 

    friction() {
        // Slow down the cue ball - friction
    }
}

class NumberedBall extends Ball {
    constructor(x, y, radius, bO, svg) {
        super(x, y, radius);
        this.number = ballOrder[bO];
        this.color = ballColors[(this.number-1) % 8];

        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");

        let ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ball.setAttribute("cx", `${x}px`);
        ball.setAttribute("cy", `${y}px`);
        if (this.number < 9) {
            ball.setAttribute("fill", this.color);
        } else {
            ball.setAttribute("fill", "white");
        }
        ball.setAttribute("r", `${ballRadius}px`);
        this.group.appendChild(ball);
        
        // Add Stripe
        if (this.number > 8) {
            let ballRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            ballRect.setAttribute("x", `${this.x-this.radius}px`);
            ballRect.setAttribute("y", `${this.y-this.radius/2}px`);
            ballRect.setAttribute("width", `${this.radius*2}px`);
            ballRect.setAttribute("height", `${this.radius}px`);
            ballRect.setAttribute("fill", this.color);
            ballRect.setAttribute("rx", `${this.radius/2}px`);
            ballRect.setAttribute("ry", `${this.radius/4}px`);
            this.group.appendChild(ballRect);
        }

        svg.appendChild(this.group);
    }
}

class CueBall extends Ball{
    constructor(x, y, radius, svg) {
        super(x, y, radius);

        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");

        let ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ball.setAttribute("cx", `${x}px`);
        ball.setAttribute("cy", `${y}px`);
        ball.setAttribute("fill", "white");
        ball.setAttribute("r", `${ballRadius}px`);
        this.group.appendChild(ball);

        svg.appendChild(this.group);

        this.group.style.transformOrigin = `${this.x}px ${this.y}px`;
    }
}