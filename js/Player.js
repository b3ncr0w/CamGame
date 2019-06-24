class Player {
    constructor(x,y) {
        this.pos = {x: x, y:y};
        this.color = "#000000";
        this.size = 10;
    }
    draw(ctx,x0,y0) {
        ctx.beginPath();
        ctx.arc(this.pos.x+x0, this.pos.y+y0, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    collision(image,x0,y0) {
        for(let j=0; j<image.height; j++) {
            for(let i=0; i<image.width; i++) {
                if(getColor(i,j,image)[0] > 0 && i+x0 < this.pos.x+this.size && i+x0 > this.pos.x-this.size && j+y0 < this.pos.y+this.size && j+y0 > this.pos.y-this.size) return true;
            }
        }
        return false;
    }
    bounding(image,x0,y0) {
        let xl = Infinity, xr = -Infinity, yu = Infinity, yb = -Infinity;
        let empty = true;
        for(let j=0; j<image.height; j++) {
            for(let i=0; i<image.width; i++) {
                if(getColor(i,j,image)[0] > 0) {
                    if(i < xl) xl = i;
                    if(j < yu) yu = j;
                    if(i > xr) xr = i;
                    if(j > yb) yb = j;
                    empty = false;
                }
            }
        }
        if(!empty){
            player.pos.x = Math.floor((xr-xl)/2+xl)+x0;
            player.pos.y = Math.floor((yb-yu)/2+yu)+y0;
        }
        else{
            player.pos.x = -100;
            player.pos.y = -100;
        }
    }
}