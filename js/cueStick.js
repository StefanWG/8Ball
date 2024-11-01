// enum CueStickState {
//     ANGLE,
//     POWER,
//     SHOOTING,
//     HIDDEN
// }

class CueStick {
    constructor(centerX, centerY, ballRadius, svg) {
        // THIS ASSUME y1 == y2 and x1 > x2
        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");
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

        this.length = this.x1 - this.x2;

        // Add parts of cue stick

        let cue1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cue1.setAttribute("x1", `${this.x1}px`);
        cue1.setAttribute("y1", `${this.y1}px`);
        cue1.setAttribute("x2", `${this.x2}px`);
        cue1.setAttribute("y2", `${this.y2}px`);
        cue1.setAttribute("stroke", "black");
        cue1.setAttribute("stroke-width", "3");
        this.group.appendChild(cue1);
        let cue2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cue2.setAttribute("x1", `${this.x1}px`);
        cue2.setAttribute("y1", `${this.y1}px`);
        cue2.setAttribute("x2", `${this.x1 - this.length*0.6}px`);
        cue2.setAttribute("y2", `${this.y2}px`);
        cue2.setAttribute("stroke", "white");
        cue2.setAttribute("stroke-width", "3");
        this.group.appendChild(cue2);
        let cue3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cue3.setAttribute("x1", `${this.x1}px`);
        cue3.setAttribute("y1", `${this.y1}px`);
        cue3.setAttribute("x2", `${this.x1 - this.length*0.05}px`);
        cue3.setAttribute("y2", `${this.y1}px`);
        cue3.setAttribute("stroke", "brown");
        cue3.setAttribute("stroke-width", "3");
        this.group.appendChild(cue3);

        svg.appendChild(this.group);

        // this.group.style.transformOrigin = `${centerX}px ${centerY}px`;
        // this.group.style.transform = "rotate(45deg)";   
    }

    updateAngle(mouseX, mouseY) {
        if (this.status != "ANGLE") {
            return;
        }
        // Compute angle between cue stick and mouse
        console.log("Mouse x: ", mouseX, "Mouse y: ", mouseY, "Center x: ", this.centerX, "Center y: ", this.centerY);
        let xDist = mouseX - this.centerX;
        let yDist = mouseY - this.centerY;
        let angle = Math.atan(yDist/xDist);

        if (xDist < 0) {
            angle += Math.PI;
        }

        // Rotate cue stick
        this.group.style.transformOrigin = `${this.centerX}px ${this.centerY}px`;
        this.group.style.transform = `rotate(${angle}rad)`;
        this.rotate = `rotate(${angle}rad)`;
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
        let xDist = mouseX - this.mouseDownX;
        let yDist = mouseY - this.mouseDownY;
        let power = Math.sqrt(xDist**2 + yDist**2);
        this.group.style.transformOrigin = `${this.centerX}px ${this.centerY}px`;
        this.group.style.transform = this.rotate + `translate(${-power}px, ${0}px)`;
        this.translate = `translate(${-power}px, ${0}px)`;
    }

    power() {
        this.status = "POWER";
    }

    shooting() {
        this.status = "SHOOTING";
        this.group.animate([
            {transform: this.rotate + this.translate},
            {transform: this.rotate + `translate(${5}px, ${0}px)`}
        ], {
            duration: 500,
            iterations: 1,
            fill: "forwards"
        });
    }
}