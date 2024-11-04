class Ball {
    /*
    Class written using code from https://stackoverflow.com/questions/60727534/balls-bouncing-off-of-each-other
    for the physical interactions between balls.
    */
    constructor(x, y, r, vx, vy, number, color) {
        this.r = r;
        this.m = 1;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.number = number;
        this.color = color;
    }

    update() {
        if (this.vx != 0 || this.vy != 0) {
            this.x += this.vx;
            this.y += this.vy;

            // Friction
            this.vx *= FRICTION
            this.vy *= FRICTION

            if (Math.sqrt(this.vx ** 2 + this.vy **2) < 0.1) {
                this.vx = 0;
                this.vy = 0;
            }
        }
    }
    draw() {
        let group = document.createElementNS("http://www.w3.org/2000/svg","g");
        let ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        if (this.number < 9) {
            ball.setAttribute("fill", this.color);
        } else {
            ball.setAttribute("fill", "white");
        }
        ball.setAttribute("cx", `${this.x}px`);
        ball.setAttribute("cy", `${this.y}px`);
        ball.setAttribute("r", `${ballRadius}px`);
        group.appendChild(ball);
        
        // Add Stripe
        if (this.number > 8) {
            let ballRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            ballRect.setAttribute("x", `${this.x-this.r}px`);
            ballRect.setAttribute("y", `${this.y-this.r/2}px`);
            ballRect.setAttribute("width", `${this.r*2}px`);
            ballRect.setAttribute("height", `${this.r}px`);
            ballRect.setAttribute("fill", this.color);
            ballRect.setAttribute("rx", `${this.r/2}px`);
            ballRect.setAttribute("ry", `${this.r/4}px`);
            group.appendChild(ballRect);
        }
        svg.appendChild(group);
    }
    interceptLineTime(l, time) {
        const u = Math.interceptLineBallTime(this.x, this.y, this.vx, this.vy, l.x1, l.y1, l.x2, l.y2,  this.r);
        if(u >= time && u <= 1) {
            return u;
        }
    }
    checkBallBallTime(t, minTime) {
        return t > minTime && t <= 1;
    }
    interceptBallTime(b, time) {
        const x = this.x - b.x;
        const y = this.y - b.y;
        const d = (x * x + y * y) ** 0.5;
        if(d > this.r + b.r) {
            const times = Math.circlesInterceptUnitTime(
                this.x, this.y, 
                this.x + this.vx, this.y + this.vy, 
                b.x, b.y,
                b.x + b.vx, b.y + b.vy, 
                this.r, b.r
            );
            if(times.length) {
                if(times.length === 1) {
                    if(this.checkBallBallTime(times[0], time)) { return times[0] }
                    return;
                }
                if(times[0] <= times[1]) {
                    if(this.checkBallBallTime(times[0], time)) { return times[0] }
                    if(this.checkBallBallTime(times[1], time)) { return times[1] }
                    return
                }
                if(this.checkBallBallTime(times[1], time)) { return times[1] }                
                if(this.checkBallBallTime(times[0], time)) { return times[0] }
            }
        }
    }
    collideLine(l, time) {
        const x1 = l.x2 - l.x1;
        const y1 = l.y2 - l.y1;
        const d = (x1 * x1 + y1 * y1) ** 0.5;
        const nx = x1 / d;
        const ny = y1 / d;            
        const u = (this.vx  * nx + this.vy  * ny) * 2;
        this.x += this.vx * time;   
        this.y += this.vy * time;   
        this.vx = (nx * u - this.vx) * WALL_LOSS;
        this.vy = (ny * u - this.vy) * WALL_LOSS;
        this.x -= this.vx * time;
        this.y -= this.vy * time;
    }
    collide(b, time) {
        const a = this;
        const m1 = a.m;
        const m2 = b.m;
        const x = a.x - b.x
        const y = a.y - b.y  
        const d = (x * x + y * y);
        const u1 = (a.vx * x + a.vy * y) / d
        const u2 = (x * a.vy - y * a.vx ) / d
        const u3 = (b.vx * x + b.vy * y) / d
        const u4 = (x * b.vy - y * b.vx ) / d
        const mm = m1 + m2;
        const vu3 = (m1 - m2) / mm * u1 + (2 * m2) / mm * u3;
        const vu1 = (m2 - m1) / mm * u3 + (2 * m1) / mm * u1;
        a.x = a.x + a.vx * time;
        a.y = a.y + a.vy * time;
        b.x = b.x + b.vx * time;
        b.y = b.y + b.vy * time;
        b.vx = x * vu1 - y * u4;
        b.vy = y * vu1 + x * u4;
        a.vx = x * vu3 - y * u2;
        a.vy = y * vu3 + x * u2;
        a.x = a.x - a.vx * time;
        a.y = a.y - a.vy * time;
        b.x = b.x - b.vx * time;
        b.y = b.y - b.vy * time;
    }
    doesOverlap(ball) {
        const x = this.x - ball.x;
        const y = this.y - ball.y;
        return  (this.r + ball.r) > ((x * x + y * y) ** 0.5);  
    }       
}