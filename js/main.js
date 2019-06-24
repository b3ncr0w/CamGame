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
//let mouse = new Mouse();
//mouse.addListeners();
let image;
mainloop = function() {
	window.requestAnimationFrame(mainloop);
	ctx.clearRect(0, 0, width, height);
	
	ctx.drawImage(video, x0, y0, vwidth, vheight);
	if(videoLoaded){
		image = ctx.getImageData(x0, y0, vwidth, vheight);
		image = compute(image);
		ctx.putImageData(image,x0,y0);

		// update position
		player.bounding(pointer,x0,y0);
		// check collisions
		if(player.collision(map,x0,y0)) player.color = "#ff0000";
		else player.color = "#00ff00";
		// draw
		if(player.pos.x < vwidth+x0) player.draw(ctx,0,0);
		start.draw(ctx);
		end.draw(ctx);
	}
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

let start = new Checkpoint();
function setStart() {
	start.pos.x = player.pos.x;
	start.pos.y = player.pos.y;
	start.color = "#00ff50";
}

let end = new Checkpoint();
function setEnd() {
	end.pos.x = player.pos.x;
	end.pos.y = player.pos.y;
	end.color = "#0050ff";
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

	// merge layers
	for(let j=0; j<image.height;  j++) {
		for(let i=0; i<image.width; i++) {
			switch(show) {
				case 1: //map hibrid
					let [mr,mg,mb] = getColor(i,j,map); 
					if(mr > 0 || mg > 0 || mb > 0) setColor(i,j,image,[0,50,200]);
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
		}
	}
	return image;
}



init();
mainloop();