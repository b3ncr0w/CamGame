let ctx;
let canvas;
let width = window.innerWidth;
let height = window.innerHeight;
let vwidth;
let vheight;
let video;
let x0;
let y0;
let flag = false;

function init() {
	video = document.getElementById('video');
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
			video.srcObject = stream;
		});
	}
	video.addEventListener( "loadedmetadata", function (e) {
		vwidth = video.videoWidth;
		vheight = video.videoHeight;
		flag = true;
	}, false );

	canvas = document.getElementById('canvas');
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext('2d');
	canvas2 = document.createElement('canvas');
}

function compute(data) {
	for(var i = 0; i < data.length; i+=4) {
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        var brightness = (3*r+4*g+b)>>>3;
        data[i] = brightness;
        data[i+1] = brightness;
        data[i+2] = brightness;
    }
}

mainloop = function() {
	window.requestAnimationFrame(mainloop);
	x0 = (width - vwidth)/2;
	y0 = (height - vheight)/2;
	ctx.drawImage(video, x0, y0, vwidth, vheight);
	if(flag){
		let idata = ctx.getImageData(x0, y0, vwidth, vheight);
		let data = idata.data;
		compute(data);
		idata.data = data;
		ctx.putImageData(idata,x0,y0);
	}
}

init();
mainloop();