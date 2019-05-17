let ctx;
let canvas;
let width = window.innerWidth; //canvas width
let height = window.innerHeight; //canvas height
let video;
let vwidth; //video width
let vheight; //vido height
let data; //pixels data

let x0, y0; //left top corner of video on canvas
let videoLoaded = false;

function init() {
	video = document.createElement('video');
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
			video.srcObject = stream;
			video.play();
		});
	}
	video.addEventListener( "loadedmetadata", function (e) {
		vwidth = video.videoWidth;
		vheight = video.videoHeight;
		x0 = (width - vwidth)/2;
		y0 = (height - vheight)/2;
		videoLoaded = true;
	}, false );

	canvas = document.getElementById('canvas');
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext('2d');
	canvas2 = document.createElement('canvas');
}

function getColor(x,y) {
	let index = (vwidth*y+x)*4;
	return [ data[index], data[index+1], data[index+2] ];
}

function setColor(x,y,color) {
	let index = (vwidth*y+x)*4;
	data[index] = color[0];
	data[index+1] = color[1];
	data[index+2] = color[2];
}

function compute() {
	for(let h=0; h<vheight; h++) {
		for(let w=0; w<vwidth; w++) {
			let r = getColor(w,h)[0]*0.2126;
			let g = getColor(w,h)[1]*0.7152;
			let b = getColor(w,h)[2]*0.0722;
			let c = r+g+b;
			setColor(w,h,[c,c,c]);
		}
	}
}

mainloop = function() {
	window.requestAnimationFrame(mainloop);
	
	ctx.drawImage(video, x0, y0, vwidth, vheight);
	if(videoLoaded){
		let idata = ctx.getImageData(x0, y0, vwidth, vheight);
		data = idata.data;
		compute(data);
		idata.data = data;
		ctx.putImageData(idata,x0,y0);
	}
}

init();
mainloop();