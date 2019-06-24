class Checkpoint {
    constructor(){
        this.pos = { x:-100, y:-100 };
        this.size = 50;
        this.color = "#0050ff";
        this.set = false;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.pos.x-this.size/2,this.pos.y-this.size/2,this.size,this.size);
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
    collision(player) {
        let i = player.pos.x;
        let j = player.pos.y;
        if(i >= this.pos.x-this.size/2 && i<= this.pos.x+this.size/2 && j >= this.pos.y-this.size/2 && j<= this.pos.y+this.size/2) {
            return true;
        }
        else return false;
    }
}