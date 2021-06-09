let facemesh;
let video;
let predictions = [];
let logo;
let logoKoordinates;
let mouth;

function preload(){
	logo = loadImage('assets/NEXTLogo.png');
}

function setup() {
	image(logo, 0, 0);
	imageMode(CENTER);
	mouth = {middle: {x: 50, y: 50}, open: false}

  	createCanvas(640, 480);
	logoStart();

  	video = createCapture(VIDEO);
  	video.size(width, height);
	video.hide();


  	facemesh = ml5.facemesh(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
	//move image by the width of image to the left
	translate(video.width, 0);
	//then scale it by -1 in the x-axis
	//to flip the image
	scale(-1, 1);
	image(video, width/2, height/2, width, height);
	  if(!logoKoordinates.eaten){

		image(logo, logoKoordinates.x, logoKoordinates.y, 45, 12.5);

	  }


  // We can call both functions to draw all KeypointsLips
  drawKeypoints();
  moveLogo();

}

// A function to draw ellipses over the detected KeypointsLips
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const keypointsLipsLower = predictions[i].annotations.lipsLowerInner;
    const keypointsLipsUpper = predictions[i].annotations.lipsUpperInner;

	updateMouth(keypointsLipsLower, keypointsLipsUpper);

    // // Draw facial KeypointsLips.
    // for (let j = 0; j < keypointsLipsUpper.length; j += 1) {
    //   const [x, y] = keypointsLipsUpper[j];

    //   fill(0, 255, 0);
    //   ellipse(x, y, 5, 5);
    // }
	// for (let j = 0; j < keypointsLipsLower.length; j += 1) {
	// 	const [x, y] = keypointsLipsLower[j];
  
	// 	fill(0, 255, 0);
	// 	ellipse(x, y, 5, 5);
	// }
  }
}

function updateMouth(lower, upper){
	mouth.middle.x = (lower[5][0]+upper[5][0])/2;
	mouth.middle.y = (lower[5][1]+upper[5][1])/2;
	if((lower[5][1]-upper[5][1])>20){
		mouth.open = true;
	}else{
		mouth.open = false;
	}

	// fill(0, 0, 255);
	// ellipse(mouth.middle.x, mouth.middle.y, 5, 5);
}

function moveLogo(){
	if(logoKoordinates.eaten == true && mouth.open){
		logoStart();
	}

	let dx = mouth.middle.x - logoKoordinates.x;
	let dy = mouth.middle.y - logoKoordinates.y;

	if (mouth.open){
		logoKoordinates.x += dx*logoKoordinates.easing;
		logoKoordinates.y += dy*logoKoordinates.easing;
	}
	if(abs(dx) < 10 && abs(dy) < 10 && mouth.open == false){
		logoKoordinates.eaten = true;
	}
}

function logoStart(){
	possibleKoordinates = [[-30, 50], [50, height+30], [width/2, -30], [- 30, 200], [400, -30], [width+30, 350]]
	let koordinates = random(possibleKoordinates);
	logoKoordinates = {x: koordinates[0], y: koordinates[1], easing: 0.03, eaten: false};
}
