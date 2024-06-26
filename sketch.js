// rectangles in grid variable settings
let rectangleWidth;
let rectangleHeight;
let lineRectangles = [];
let drawRectangles = true;
let lineSpacing = 10;

//declaring variables that are being used for the code to interact with sound
let boingSound; 
let bingSound;
let song;
let button;
let soundOn = false; // variable to track if sound should be played
let level;


// character blocks variable settings
let charaBlocks = [];   // character blocks array
let boundary = [];  // boundary array

// grid color variables
let yellow;
let blue;
let beige;
let red;



//loading all necessary sounds
//loading sound for chracter interaction with boundries
//loading backgound music for size chaning in shapes
function preload() {
  boingSound = loadSound("assets/boingSound.mp3");
  bingSound = loadSound("assets/bingSound.mp3");
  song = loadSound("assets/song.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //initialising the p5.js function to get the amplitude from the outputted sound
  amplitude = new p5.Amplitude();

  let numRectanglesWidth = width/25;
  let numRectanglesHeight = height/25;
  rectangleWidth = width / numRectanglesWidth;
  rectangleHeight = height / numRectanglesHeight;

  //add a button to play/pause the audio
  button = createButton('Play/Pause');
  //set styles for the button
  button.position((width - button.width) / 6, (height - button.height) / 8 * 7 + 20);
  button.size(80, 40);
  //this is where we pass the function we want to run when the betton is clicked
  button.mousePressed(play_pause);


  // Create a colors scheme for the rectangles in grid
  yellow = color(236 , 214, 38);
  blue = color(68, 105, 186);
  beige = color(217, 216, 211);
  red = color(176, 58, 46);

  // Create array of the color scheme
  randomColors = [yellow, blue, beige, red];

  // Define starting points for vertical grid lines
  let verticalStartX = [width/3, width/2, width/2 + 40, width/4*3];

  // Define starting points for horizontal grid lines
  let horizontalStartY = [height/8, height/2, height/5*4];

  // Create horizontal grid lines
  for (let i = 0; i < horizontalStartY.length; i++) {
    let startY = horizontalStartY[i];
    for (let j = 0; j < numRectanglesWidth; j++) {
      let x = j * rectangleWidth;
      let y = startY;
      let horizontalLines = new Rectangle(x, y, rectangleWidth, rectangleHeight, random(randomColors));
      lineRectangles.push(horizontalLines);
    }
  }

  // Create vertical grid lines
  for (let i = 0; i < verticalStartX.length; i++) {
    let startX = verticalStartX[i];
    for (let j = 0; j < numRectanglesHeight; j++) {
      let x = startX;
      let y = j * rectangleHeight;
      let verticalLines = new Rectangle(x, y, rectangleWidth, rectangleHeight, random(randomColors));
      lineRectangles.push(verticalLines);
    }
  }

  // Character's block width and height
  let charaWidth = random(width/20, width/10); // randomised between 30 to 50
  let charaHeight = random(width/20, width/10);

  // Define each of the boundaries with the start (x,y) points and end (x,y) points
  let bound_startX = [0+charaWidth/2, verticalStartX[2]+rectangleWidth+charaWidth/2, verticalStartX[3]+rectangleWidth+charaWidth/2];
  let bound_endX = [verticalStartX[0]-charaWidth/2, verticalStartX[3]-charaWidth/2, width-charaWidth/2];
  let bound_startY = [horizontalStartY[0]+rectangleWidth+charaHeight/2,horizontalStartY[1]+rectangleWidth+charaHeight/2];
  let bound_endY = [horizontalStartY[1]-charaHeight/2, horizontalStartY[2]-charaHeight/2];

  // Add each defined boundary to boundary array (6 boundaries)
  boundary.push({startX:bound_startX[0], startY:bound_startY[0], endX:bound_endX[0], endY:bound_endY[0]});
  boundary.push({startX:bound_startX[0], startY:bound_startY[1], endX:bound_endX[0], endY:bound_endY[1]});
  
  boundary.push({startX:bound_startX[1], startY:bound_startY[0], endX:bound_endX[1], endY:bound_endY[0]});
  boundary.push({startX:bound_startX[1], startY:bound_startY[1], endX:bound_endX[1], endY:bound_endY[1]});

  boundary.push({startX:bound_startX[2], startY:bound_startY[0], endX:bound_endX[2], endY:bound_endY[0]});
  boundary.push({startX:bound_startX[2], startY:bound_startY[1], endX:bound_endX[2], endY:bound_endY[1]});

  for(let i = 0; i < 6; i++){
    // pick random boundary
    let randomBoundary = boundary[floor(random()*boundary.length)];
    // find index of the randomBoundary in the boundary array and remove that randomBoundary that's already been selected
    boundary.splice(boundary.indexOf(randomBoundary),1);

    // define charaDetails for all the character blocks
    let charaDetails = {
      x: random(randomBoundary.startX,randomBoundary.endX), 
      y: random(randomBoundary.startY,randomBoundary.endY),
      w: charaWidth,
      h: charaHeight, 
      state: random()>=0.5,
      boundary: randomBoundary
    }

    // create the same number of chara1 and chara2 then push it to charaBlocks array
    if(i % 2 == 0){
      charaBlocks.push(new chara1(charaDetails));
    }else{
      charaBlocks.push(new chara2(charaDetails));
    }
  }
}


//function controlling the play/pause button to control if sound is on or off
function play_pause() {

  // variable that controls weather sound is on or off
  //use of a booleon varaible to distinish actions 
  soundOn = !soundOn; 
  if (soundOn) {
    song.play();
    song.loop();
    button.html("Pause");
  } else {
    button.html("Play");
    //make the audio stop when paused
    boingSound.stop(); 
    bingSound.stop();
    song.stop();
  }
}



function draw() {
  background(230, 213, 190);



  // draw the grid made up of rectangles
  if (drawRectangles) {
    for (const rect of lineRectangles) {
      rect.draw();
    }
  }

  //create a variable to store the continuously updating amplitude
  level = amplitude.getLevel();

  //set the volume of different audio to make sound effects heard but not overpowering, plus to smooth differences between the 3 audios
  bingSound.setVolume(0.3);
  boingSound.setVolume(0.2);
  song.setVolume(0.5);



  // draw each character block
  for(let chara of charaBlocks){
    chara.move();
    chara.checkCollision();
    chara.draw();
  }


  
  stroke(0);
}

class Rectangle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {

    //reinitionalise collecting amplitude into level var as this is a seprate draw function
    level = amplitude.getLevel();

    fill(this.color);

    //Apply the level var with aplitude stored inside to control the growth of rects in line segments depending on amplitude
    //declare if/else statement using boolean from play/pause button to control the growth of the rectangles depending on sound on/off
    if (soundOn) {
      rect(this.x, this.y, this.width * level * 2, this.height * level * 2);

    } else {
          rect(this.x, this.y, this.width, this.height);
    }
  }
}

class chara1{
  constructor(charaDetails){
    this.x = charaDetails.x;
    this.y = charaDetails.y;
    this.baseWidth = charaDetails.w;  // width for the biggest rectangle
    this.baseHeight = charaDetails.h; // height for the biggest rectangle
    this.innerWidth = charaDetails.w * 0.5; // width for the inner medium rectangle
    this.innerHeight = charaDetails.h * 0.5; // height for the inner medium rectangle
    this.smallestWidth = charaDetails.w * 0.25; // width for the smallest rectangle
    this.smallestHeight = charaDetails.h * 0.25; // height for the smallest rectangle
    this.breathingSpeed = 0.10; // Speed of breathing effect

    this.speed = random(2,5); // speed of character's movement
    this.direction = 1; // direction of character's movement (1 = move right or move down; -1 = move left or move up)
    this.Horizontal = charaDetails.state; // true if the character moves horizontally, and false if it moves vertically
    this.boundary = charaDetails.boundary; // set the boundary in which the character can move
  }

  update() {
    // breathing effects for each of the rectangles
    let breathSizeOuter = sin(frameCount* this.breathingSpeed) * 5;
    this.currentWidth = this.baseWidth + breathSizeOuter;
    this.currentHeight = this.baseHeight + breathSizeOuter;

    let breathSizeInner = sin(frameCount * this.breathingSpeed + 180 / 2) * 2; // Offset phase for inner medium rectangle
    this.innerWidth = this.baseWidth * 0.5 + breathSizeInner;
    this.innerHeight = this.baseHeight * 0.5 + breathSizeInner;

    let breathSizeSmallest = sin(frameCount * this.breathingSpeed + 180) * 0.5; // Further offset phase for smallest rectangle
    this.smallestWidth = this.baseWidth * 0.25 + breathSizeSmallest;
    this.smallestHeight = this.baseHeight * 0.25 + breathSizeSmallest;
  }

  display(){
    push();
    rectMode(CENTER); // set rectMode to center

    // Display the biggest rectangle
    fill('#4682B4');  // Blue color 
    stroke(255);     
    rect(this.x, this.y, this.currentWidth, this.currentHeight);

    // Display the inner medium rectangle
    fill('#FFD700');  // Yellow color
    stroke(255);       
    rect(this.x, this.y, this.innerWidth, this.innerHeight);

    // Display the smallest rectangle
    fill('#FFFFFF');  // White color
    noStroke();       
    rect(this.x, this.y, this.smallestWidth, this.smallestHeight);
    pop();
  }

  draw(){
    this.update();
    this.display();
  }

  move(){
    // move horizontally if character's state is true, and vertically if it's false
    if(this.Horizontal){
      this.x += this.speed * this.direction;
    } else {
      this.y += this.speed * this.direction;
    }
  }

  checkCollision(){
    // check the collision with the grid
    // if it moves horizontal, change the direction when it touches the x boundary
    // if it moves vertical, change the direction when it touches the y boundary

    //check if chracter has collided with a boundry through boolean statements and play boingSound upon every collusion if the sound is on
    //declare boolean variable stating that now nothing is collided
    //declate collided var as true when x and y boundries are hit
   let collided = false;
    if (this.Horizontal) {
      if (this.x <= this.boundary.startX || this.x >= this.boundary.endX) {
        this.direction *= -1;
       collided = true;
      }
    } else {
      if (this.y <= this.boundary.startY || this.y >= this.boundary.endY) {
        this.direction *= -1;
       collided = true;
      }
    }

    // play sound upon collision but only if the sound is on +  based on collided var 
    if (collided && soundOn) {
     bingSound.play();
   }
  }
}





class chara2{
  constructor(charaDetails){
    this.x = charaDetails.x;
    this.y = charaDetails.y;
    this.width = charaDetails.w;
    this.height = charaDetails.h;

    this.speed = random(2,5); // speed of character's movement
    this.direction = 1; // direction of character's movement (1 = move right or move down; -1 = move left or move up)
    this.Horizontal = charaDetails.state; // true if the character moves horizontally, and false if it moves vertically
    this.boundary = charaDetails.boundary; // set the boundary in which the character can move
  }
  
  draw() {    

    level = amplitude.getLevel() * 50;
    console.log(level);
    push();
    angleMode(DEGREES);
    rectMode(CENTER);
    fill(`#D9D8D4`);
    stroke(`#ecd626`);
    strokeWeight(3);
  
    // Translate to the position without rotating or scaling
    translate(this.x, this.y);

    // Draw the character
    // BG Rectangle
    strokeWeight(0);
    rect(0, 0, this.width, this.height); // Adjust the size as needed


    //moving rectangles
    //styles
    noStroke();

    //rectangle with minor movement 
    //change the color of the rectanlge depending on level of amplitude
    //change the growth of the rectangle stroke depending on the level of the amplitude 
    fill(68 * (level* width), 105, 186);
    stroke(`#4469BA`); 
    strokeWeight(3 * level);

    let growthCharZ = sin(frameCount * 2) * 0.5 + 0.5;

    let mediumInsideRectWidth = map(growthCharZ, 0, 1, this.width/4 * 3, this.width); // Map the growth factor to the width
    let mediumInsideRectHeight = map(growthCharZ, 0, 1, this.height/4 * 3, this.height); // Map the growth factor to the height
    rect(0, 0, mediumInsideRectWidth, mediumInsideRectHeight);
   
    //static rectangle 
    fill(236, 213, 39);
    stroke(`#4469BA`);
    strokeWeight(2);
    rect(0, 0, this.width/8 * 6, this.height/8 * 6)

  
    // Eyes
    let flip = sin(frameCount) * 2; // [-1, 1]
    this.eyeOne(-this.width/6, -this.height/8, flip); // Position and scale of the eye
    this.eyeTwo(this.width/6, -this.height/8, flip); // Position and scale of the eye

    // Mouth
    noStroke();
    stroke(`#b03a2e`);
    strokeWeight(3)
    fill(`#D9D8D4`);
    ellipse(0, this.height/6, (this.width/3), this.height/10);    

    pop();
    angleMode(RADIANS);
  }

  eyeOne(x, y, flip) {
    push();
    noStroke();
    translate(x,y); // Position the eye based on provided coordinates
    scale(flip, 2);
    if (flip > 0) {
      fill(`#4469BA`);
    } else {
      fill(`#b03a2e`); // Change the color when flipped
    }
    ellipse(0, 0, this.width/8);
    pop();
  }

  eyeTwo(x, y, flip) {
    push();
    noStroke();
    translate(x,y); // Position the eye based on provided coordinates
    scale(flip, 2);
    if (flip > 0) {
      fill(`#b03a2e`);
    } else {
      fill(`#4469BA`); // Change the color when flipped
    }
    ellipse(0, 0, this.width/8);
    pop();
  }

  move(){
    // move horizontally if character's state is true, and vertically if it's false
    if(this.Horizontal){
      this.x += this.speed * this.direction;
    } else {
      this.y += this.speed * this.direction;
    }
  }


  checkCollision(){

    // check the collision with the grid
    // if it moves horizontal, change the direction when it touches the x boundary
    // if it moves vertical, change the direction when it touches the y boundary

    //check if chracter has collided with a boundry through boolean statements and play boingSound upon every collusion if the sound is on
    let collided = false;
    if (this.Horizontal) {
      if (this.x <= this.boundary.startX || this.x >= this.boundary.endX) {
        this.direction *= -1;
        collided = true;
      }
    } else {
      if (this.y <= this.boundary.startY || this.y >= this.boundary.endY) {
        this.direction *= -1;
        collided = true;
      }
    }

    // play sound upon collision but only if the sound is on
    if (collided && soundOn) {
      if (!boingSound.isPlaying()) {
        boingSound.play();
      }
    }
  }
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
