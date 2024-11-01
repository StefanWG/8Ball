class CueStick {
    constructor(centerX, centerY, ballRadius) {
        // THIS ASSUME y1 == y2 and x1 > x2
        this.x1 = centerX-ballRadius-5;
        this.y1 = centerY;
        this.x2 = centerX-ballRadius-205;
        this.y2 = centerY;
        this.centerX = centerX;
        this.centerY = centerY;
        this.status="ANGLE";
        this.mouseDownX = NaN;
        this.mouseDownY = NaN;
        this.translate = "";
        this.rotate = "";
        this.direction = 0;
        this.group = null;

        this.length = this.x1 - this.x2;
    }

    getSVGGroup() {
        let group = document.createElementNS("http://www.w3.org/2000/svg","g");
        group.id = "cueStick"

        // Draw Cue

        let cue1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cue1.setAttribute("x1", `${this.x1}px`);
        cue1.setAttribute("y1", `${this.y1}px`);
        cue1.setAttribute("x2", `${this.x2}px`);
        cue1.setAttribute("y2", `${this.y2}px`);
        cue1.setAttribute("stroke", "black");
        cue1.setAttribute("stroke-width", "3");
        group.appendChild(cue1);
        let cue2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cue2.setAttribute("x1", `${this.x1}px`);
        cue2.setAttribute("y1", `${this.y1}px`);
        cue2.setAttribute("x2", `${this.x1 - this.length*0.6}px`);
        cue2.setAttribute("y2", `${this.y2}px`);
        cue2.setAttribute("stroke", "white");
        cue2.setAttribute("stroke-width", "3");
        group.appendChild(cue2);
        let cue3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cue3.setAttribute("x1", `${this.x1}px`);
        cue3.setAttribute("y1", `${this.y1}px`);
        cue3.setAttribute("x2", `${this.x1 - this.length*0.05}px`);
        cue3.setAttribute("y2", `${this.y1}px`);
        cue3.setAttribute("stroke", "brown");
        cue3.setAttribute("stroke-width", "3");
        group.appendChild(cue3);

        group.style.transformOrigin = `${this.centerX}px ${this.centerY}px`; 
        this.group = group;
        return group;
    }

    updateAngle(mouseX, mouseY) {
        if (this.status != "ANGLE") {
            return;
        }
        // Compute angle between cue stick and mouse
        let xDist = mouseX - this.centerX;
        let yDist = mouseY - this.centerY;
        this.direction = Math.atan(yDist/xDist);

        if (xDist < 0) {
            this.direction += Math.PI;
        }

        // Rotate cue stick
        this.group.style.transformOrigin = `${this.centerX}px ${this.centerY}px`;
        this.group.style.transform = `rotate(${this.direction}rad)`;
        this.rotate = `rotate(${this.direction}rad)`;
    }

    powerUp(mouseX, mouseY, firstClick) {
        if (this.status != "POWER") {
            return;
        }
        if (firstClick) {
            this.mouseDownX = mouseX;
            this.mouseDownY = mouseY;
            return;
        }

        // Compute power and translate cue stick
        // TODO: Max power
        // TODO: Exponential power
        // TODO: Power bar
        // TODO: Min power to reset
        let xDist = mouseX - this.mouseDownX;
        let yDist = mouseY - this.mouseDownY;
        let power = Math.sqrt(xDist**2 + yDist**2);
        this.group.style.transform = this.rotate + `translate(${-power}px, ${0}px)`;
        this.translate = `translate(${-power}px, ${0}px)`;
        // document.documentElement.style.setProperty('--anim-x', power);

    }

    power() {
        this.status = "POWER";
    }

    shooting() {
        this.status = "SHOOTING";
        console.log(this.group);
        // TODO: On animation end, fade to hidden

        this.group.style.animationName = "shoot";
        this.group.style.animationFillMode = "forwards";
        this.group.style.animationTimingFunction = "linear";
        this.group.style.animationDuration = "1s";
    }
}