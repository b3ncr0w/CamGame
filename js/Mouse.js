class Mouse {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    addListeners() {
        window.addEventListener("mousemove", this.getPos, false);
    }
    getPos(event) {
        this.x = event.clientX;
        this.y = event.clientY;

        player.pos.x = this.x;
        player.pos.y = this.y;
    }
}