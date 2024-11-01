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
        this.strength = 0;

        this.length = this.x1 - this.x2;
        this.powerBar = new PowerBar(this);
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
        // TODO: Min power to reset
        let xDist = mouseX - this.mouseDownX;
        let yDist = mouseY - this.mouseDownY;
        let strength = Math.min(Math.sqrt(xDist**2 + yDist**2), MAXPOWER);
        this.strength = Math.min(strength / MAXPOWER, 1);
        this.group.style.transform = this.rotate + `translate(${-strength}px, ${0}px)`;
        this.translate = `translate(${-strength}px, ${0}px)`;
        
        let pbf = document.getElementById("powerBarFiller");
        let hAdjust = this.powerBar.height*this.strength
        pbf.setAttribute("y", `${TABLESIZE*1.28/4+this.powerBar.height/2 - hAdjust}px`);
        pbf.setAttribute("height", `${hAdjust}px`);
        pbf.setAttribute("fill", `color-mix(in HSL, yellow ${100-this.strength*100}%, red)`);
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

class PowerBar {
    constructor(cueStick) {
        this.height = TABLESIZE/2 * 0.75;
        this.width = 30;
        this.group = null;
        this.cueStick = cueStick;

    }

    getSVGGroup() {
        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.group.id = "powerBar";

        console.log(this.cueStick)

        // Draw power
        let power = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        power.id = "powerBarFiller";
        power.setAttribute("width", `${this.width}px`);
        power.setAttribute("height", `${this.height*this.cueStick.strength}px`);
        power.setAttribute("fill", "red");
        power.setAttribute("x", `${TABLESIZE*1.14 + 30}px`);
        power.setAttribute("y", `${TABLESIZE*1.28/4-this.height/2}px`);
        power.setAttribute("rx", "10");
        this.group.appendChild(power);
        console.log("Bar Height ", this.height*this.cueStick.strength);

        // Draw border

        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("width", `${this.width}px`);
        rect.setAttribute("height", `${this.height}px`);
        rect.setAttribute("stroke", "black");
        rect.setAttribute("stroke-width", "3"); 
        rect.setAttribute("fill", "white");
        rect.setAttribute("fill-opacity", "0");
        rect.setAttribute("x", `${TABLESIZE*1.14 + 30}px`);
        rect.setAttribute("y", `${TABLESIZE*1.28/4-this.height/2}px`);
        rect.setAttribute("rx", "10");
        this.group.appendChild(rect);

        // Draw divisions
        let divisions = 10;

        for (let i = 1; i < divisions; i++) {
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            let y = TABLESIZE*1.28/4-this.height/2 + this.height/divisions*i;
            line.setAttribute("x1", `${TABLESIZE*1.14 + 35}px`);
            line.setAttribute("y1", `${y}px`);
            line.setAttribute("x2", `${TABLESIZE*1.14 + 25+this.width}px`);
            line.setAttribute("y2", `${y}px`);
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "3");
    
            this.group.appendChild(line);
        }

        return this.group;
    }
}