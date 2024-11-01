class CueStick {
    constructor(x1, y1, x2, y2, svg) {
        // THIS ASSUME y1 == y2 and x1 > x2
        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.length = x1 - x2;

        // Add parts of cue stick

        let cue1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cue1.setAttribute("x1", `${x1}px`);
        cue1.setAttribute("y1", `${y1}px`);
        cue1.setAttribute("x2", `${x2}px`);
        cue1.setAttribute("y2", `${y2}px`);
        cue1.setAttribute("stroke", "black");
        cue1.setAttribute("stroke-width", "3");
        this.group.appendChild(cue1);
        let cue2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cue2.setAttribute("x1", `${x1}px`);
        cue2.setAttribute("y1", `${y1}px`);
        cue2.setAttribute("x2", `${x1 - this.length*0.6}px`);
        cue2.setAttribute("y2", `${y2}px`);
        cue2.setAttribute("stroke", "white");
        cue2.setAttribute("stroke-width", "3");
        this.group.appendChild(cue2);
        let cue3 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        cue3.setAttribute("x1", `${x1}px`);
        cue3.setAttribute("y1", `${y1}px`);
        cue3.setAttribute("x2", `${x1 - this.length*0.05}px`);
        cue3.setAttribute("y2", `${y1}px`);
        cue3.setAttribute("stroke", "brown");
        cue3.setAttribute("stroke-width", "3");
        this.group.appendChild(cue3);

        svg.appendChild(this.group);
    }
}