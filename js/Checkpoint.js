class Checkpoint {
    constructor(){
        this.pos = { x:-100, y:-100 };
        this.size = 50;
        this.color = "#0050ff";
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.pos.x-this.size/2,this.pos.y-this.size/2,this.size,this.size);
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
}