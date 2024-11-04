class Line{
    constructor(x1,y1,x2,y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    draw() {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", this.x1);
        line.setAttribute("y1", this.y1);
        line.setAttribute("x2", this.x2);
        line.setAttribute("y2", this.y2);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
    }
    reverse() {
        const x = this.x1;
        const y = this.y1;
        this.x1 = this.x2;
        this.y1 = this.y2;
        this.x2 = x;
        this.y2 = y;
        return this;
    }
}