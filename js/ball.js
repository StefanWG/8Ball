let ballColors = ["yellow", "blue", "red", "purple", "orange", "darkgreen", "maroon", "black"];
let ballOrder = [1, 3, 13, 2, 7, 10, 8, 15, 12, 6, 4, 5, 9, 11, 14]; // TODO: Randomize this?

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.radius = radius;
        this.speed = 0; // in inches per second
        this.direction = 0; // in radians

        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.group.style.transformOrigin = `${this.x}px ${this.y}px`;
    }

    move(FPS) {
        if (this.speed == 0) {
            return;
        }

        // Move the ball
        let distance = this.speed * (TABLESIZE / 100) / FPS
        let ddx = distance * Math.cos(this.direction);
        let ddy = distance * Math.sin(this.direction);
        this.dx += ddx;
        this.dy += ddy;
        this.x += ddx;
        this.y += ddy;
        

        if (this.x >= edges["right"] - ballRadius) { // Right Side
            this.direction = Math.PI - this.direction;
        }

        if (this.x <= edges["left"] + ballRadius) { // Left Side
            this.direction = Math.PI - this.direction;
        }

        if (this.y >= edges["bottom"] - ballRadius) { // Bottom
            this.direction = -this.direction;
        }

        if (this.y <= edges["top"] + ballRadius) { // Top
            this.direction = -this.direction;
        }

        this.group.style.transform = `translate(${this.dx}px, ${this.dy}px)`;
    } 

    fallInPocket() {
        for (let pocket of pocketsXY) {
            if (Math.sqrt((pocket[0] - this.x) ** 2 + (pocket[1] - this.y) ** 2) < 20 * ballRadius) {
                this.group.firstChild.setAttribute("color", `red`);
                // console.log("FELL IN POCKET");
                return true;
            }
        }
    }

    findCollisions(balls) {
        for (let ball of balls) {
            if (ball == this) {
                continue;
            }
            if (Math.sqrt((ball.x - this.x) ** 2 + (ball.y - this.y) ** 2) < 2 * ballRadius) {
                this.collide(ball);
            }
        }
    }

    friction() {
        if (this.speed < 5) {
            this.speed = 0;
        } else {
            this.speed *= 0.9996;
        }
    }

    getVelocityVector() {
        return [this.speed * Math.cos(this.direction), this.speed * Math.sin(this.direction)];
    }

    rotate(angle, vector) {
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        let rotatedVed =  [vector[0] * Math.cos(angle) - vector[1] * Math.sin(angle), vector[0] * Math.sin(angle) + vector[1] * Math.cos(angle)];
        return rotatedVed;
    }

    setSpeedAndDirection(vector) {
        this.speed = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
        this.direction = Math.atan(vector[1] / vector[0]);
    }

    collide(ball) {
        console.log(balls);
        // console.log("COLLIDING!", this.speed, this.direction)
        let veloVector = this.getVelocityVector();
        let veloVectorOther = ball.getVelocityVector();

        let theta = Math.atan((ball.y - this.y) / (ball.x - this.x));
        let u1 = this.rotate(theta, veloVector);
        let u2 = this.rotate(theta, veloVectorOther);
        // console.log(u1, u2, theta);
        let v1 = this.rotate( -theta, [u2[0], u1[1]]);
        let v2 = this.rotate( -theta, [u1[0], u2[1]]);
        // console.log(v1);

        this.setSpeedAndDirection(v1);
        ball.setSpeedAndDirection(v2);

        // console.log(this.speed, this.direction);

        // clearInterval(ballMoveIntervalId);
    }
}

class NumberedBall extends Ball {
    constructor(x, y, radius, bO, svg) {
        super(x, y, radius);
        this.number = ballOrder[bO];
        this.color = ballColors[(this.number-1) % 8];

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
        let ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ball.setAttribute("cx", `${x}px`);
        ball.setAttribute("cy", `${y}px`);
        ball.setAttribute("fill", "white");
        ball.setAttribute("r", `${ballRadius}px`);
        this.group.appendChild(ball);

        svg.appendChild(this.group);
    }
}