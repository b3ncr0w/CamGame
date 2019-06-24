let ctx;
let canvas;
let width = window.innerWidth; //canvas width
let height = window.innerHeight; //canvas height
let x0, y0; //left top corner of video on canvas

// INIT
let video;
let vwidth; //video width
let vheight; //vido height
let videoLoaded = false;
function init() {
	// video load
	video = document.createElement('video');
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
			video.srcObject = stream;
			video.play();
		});
	}
	video.addEventListener( "loadedmetadata", function (e) {
		vwidth = video.videoWidth;
		vheight = height;
		vwidth = height/video.videoHeight * video.videoWidth;
		x0 = Math.ceil((width - vwidth)/2)-160;
		y0 = 0;
		videoLoaded = true;

		// show menu
		document.getElementById("menu").style.left = x0 + vwidth + 20 +"px";
		document.getElementById("menu").style.display = "block";
	}, false );
	// canvas settings
	canvas = document.getElementById('canvas');
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext('2d');
	
}
// MAIN LOOP
let player = new Player();
let image;
let gameStarted = false;
let gameWon = false;
let notification = "Witaj w CamGame!";
let notifColor = "#2eaf2e";
let time = 0;

mainloop = function() {
	window.requestAnimationFrame(mainloop);
	ctx.clearRect(0, 0, width, height);
	
	ctx.drawImage(video, x0, y0, vwidth, vheight);
	if(videoLoaded){
		image = ctx.getImageData(x0, y0, vwidth, vheight);
		image = compute(image);
		ctx.putImageData(image,x0,y0);

		// check pointer position and update player pos
		player.bounding(pointer,x0,y0);
		// check collisions
		if(player.collision(map,x0,y0)) { // collision with Map
			if(gameStarted) {
				gameStarted = false;
				let hitSound = new Audio('sounds/fail.wav');
				hitSound.play();
			}
			player.color = "#ff0000";
		}
		else if(start.set && start.collision(player) && !gameStarted) { // collision with Start
			if(start.set && end.set) {
				notifColor = "#8271c2";
				notification = "Gra rozpoczęta!";
				time = 0;
				gameStarted = true;
				gameWon = false;
				player.color = "#0000ff";
				let hitSound = new Audio('sounds/start.wav');
				hitSound.play();
			}
		}
		else if(end.set && end.collision(player) && gameStarted) { // collision with End
			if(start.set && end.set) {
				notifColor = "#ffff00";
				notification = "Gratulacje! Poziom ukończony!";
				gameWon = true;
				let hitSound = new Audio('sounds/end.mp3');
				hitSound.play();
				gameStarted = false;
				player.color = "#ffff00";
			}
		}
		else if(!gameStarted) {
			if(!gameWon) time = 0;
			notifColor = "#2eaf2e";
			if(start.set && end.set) notification = "Wróć na START!";
			else if(start.set && !end.set) notification = "Ustaw punkt końcowy";
			else if(!start.set && end.set) notification = "Ustaw punkt początkowy";
			player.color = "#000000";
		}
		// draw
		if(player.pos.x < vwidth+x0) player.draw(ctx,0,0);
		start.draw(ctx);
		end.draw(ctx);

		//count time
		if(gameStarted) setTimeout(async function(){time += 0.1},100);

		//notifications
		ctx.font = "30px Montserrat";
		ctx.fillStyle = notifColor;
		ctx.fillText(notification, 10+x0, 30+y0);
		ctx.fillStyle = "#8271c2";
		ctx.fillText(time.toPrecision(2).toString()+"s", vwidth+x0-100, 30+y0);
	}
}

let start = new Checkpoint();
function setStart() {
	start.pos.x = player.pos.x;
	start.pos.y = player.pos.y;
	start.color = "#00aa50";
	start.set = true;
	let hitSound = new Audio('sounds/map.wav');
	hitSound.play();
}

let end = new Checkpoint();
function setEnd() {
	end.pos.x = player.pos.x;
	end.pos.y = player.pos.y;
	end.color = "#0050aa";
	end.set = true;
	let hitSound = new Audio('sounds/map.wav');
	hitSound.play();
}

// IMAGE PROCESSING
function getColor(x,y,image) {
	let index = (image.width*y+x)*4;
	return [ image.data[index], image.data[index+1], image.data[index+2] ];
}

function setColor(x,y,image,[r,g,b]) {
	let index = (image.width*y+x)*4;
	image.data[index] = r;
	image.data[index+1] = g;
	image.data[index+2] = b;
}
let map;
let mapDone = false;
let mapTreshold = 100;

let pointer;
let pointerTreshold = 250;

let show = 0;
function compute(image) {
	// compute layers
	if(!mapDone) map = ctx.createImageData(image.width,image.height);
	pointer = ctx.createImageData(image.width,image.height);
	for(let j=0; j<image.height; j++) {
		for(let i=0; i<image.width; i++) {
			[r,g,b] = getColor(i,j,image);
			let lum = r*0.2126 + g*0.7152 + b*0.0722; //luminance
			// get map
			if(!mapDone) {
				if(lum < mapTreshold) { r=1; g=1; b=1; }
				else { r=0; g=0; b=0; }
				setColor(i,j,map,[r,g,b]);
			}
			// get pointer
			if(lum > pointerTreshold) { r=1; g=1; b=1; }
			else { r=0; g=0; b=0; }
			setColor(i,j,pointer,[r,g,b]);
		}
	}

	// show
	for(let j=0; j<image.height;  j++) {
		for(let i=0; i<image.width; i++) {
			switch(show) {
				case 1: //map hibrid
					let [mr,mg,mb] = getColor(i,j,map); 
					if(mr > 0 || mg > 0 || mb > 0) setColor(i,j,image,[0,0,0]);
					break;
				case 2: //just map
					let [zr,zg,zb] = getColor(i,j,map);
					setColor(i,j,image,[zr*255,zg*255,zb*255]);
					break;
				case 3: //just pointer
					let [pr,pg,pb] = getColor(i,j,pointer);
					setColor(i,j,image,[pr*255,pg*255,pb*255]);
					break;
			}
			// black strip under notifications
			let [r,g,b] = getColor(i,j,image);
			if(j < 50) setColor(i,j,image,[r/2,g/2,b/2]);
		}
	}
	return image;
}



init();
mainloop();