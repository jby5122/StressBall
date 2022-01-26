// The serviceUuid must match the serviceUuid of the device you would like to connect
const serviceUuid = "d0421f1c-e415-4098-9702-804c0444067a";
let forceCharacteristic;
let latestForceData = 0;
let myBLE;
let mode = 0;
var bubbles;
var index = 0;
let listOfGoodBubble = [];
let listOfOkBubble = [];
let listOfBadBubble = [];
let connectButton;
let button1;
let button2;



function preload(){
  goodBubble = loadImage ('assets/goodBubble.jpg')
  okBubble = loadImage ('assets/okBubble.jpg')
  badBubble = loadImage ('assets/badBubble.jpg')
  aniBubble = loadAnimation ('assets/badBubble.jpg','assets/okBubble.jpg', 'assets/goodBubble.jpg')
  aniBubble.playing = false;
  pop1 = loadSound ('assets/pop1.mp3');
  pop2 = loadSound ('assets/pop2.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background (255)
  // Create a p5ble class
  myBLE = new p5ble();

  textSize(60);
  textAlign(CENTER, CENTER);
  text ('Use connect button to connect bluetooth', width/2, (height/2)-120)
  textSize(20);
  text ('Mode 1: Air Bubbles', width/2, height/2)
  text ('Mode 2: Crunch Ramen (In progress', width/2, (height/2)+120)


  // Create a 'Connect' button
  connectButton = createButton('Connect')
  button1 = createButton("Mode1");
  button2 = createButton("Mode2");
  connectButton.position ( width/2, (height/2)-60)
  button1.position (width/2, (height/2)+60)
  button2.position (width/2, (height/2)+180)
  connectButton.mousePressed(connectToBle);
  button1.mousePressed (modeSelect1);
  button2.mousePressed (modeSelect2);


  
  bubbles = new Group ();
  for(var x = 40; x < windowWidth; x += 80) {
    for (var y = 40; y < windowHeight; y +=80 ){
      var newbubble = createSprite(x, y);
      newbubble.addImage ('goodBubble',goodBubble)
      newbubble.addImage ('okBubble',okBubble) 
      newbubble.addImage('badBubble', badBubble);
      newbubble.addAnimation('popBubble', aniBubble);
      bubbles.add(newbubble);
      listOfGoodBubble.push (index);
      index += 1;
    }
  }

  

}

function connectToBle() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, Characteristic) {
  if (error) console.log('error: ', error);
  console.log('characteristics: ', Characteristic);
  forceCharacteristic = Characteristic[0];
  // Read the value of the first characteristic
  myBLE.read(forceCharacteristic, gotPinValue);
}

// A function that will be called once got values
function gotPinValue(error, Pinvalue) {
  if (error) console.log('error: ', error);
  console.log('value: ', Pinvalue);
  latestForceData = Pinvalue;
  // After getting a value, call p5ble.read() again to get the value again
  myBLE.read(forceCharacteristic, gotPinValue);
  
}

function draw() {
  
  if (mode ==1) {
    background (255);
    connectButton.hide();
    button1.hide();
    button2.hide();
    if (listOfBadBubble.length == index){
      console.log ("game over")
      drawSprites(bubbles);
      return;
    }
    
    for(var i = 0; i<bubbles.length; i++) {
      var b = bubbles[i];
      b.addAnimation('popBubble', aniBubble)
    }
  
    if(latestForceData > 100 && latestForceData <= 200) {
      if (listOfGoodBubble.length == 0) {
        console.log ("push harder")
        drawSprites(bubbles);
        return;
      }
      let selectGoodBubble = int (random (listOfGoodBubble.length))
      a = listOfGoodBubble.splice (selectGoodBubble, 1)
      listOfOkBubble.push (a)
      setTimeout(() => {  pop1.play();bubbles[a].changeImage ('okBubble'); }, 10)
      // sleep(2000);
      console.log('play sound')
      
      console.log("change image")
      
      // console.log ("list length", listOfGoodBubble.length)
      
      sleep(100)
      // setTimeout(() => {  console.log("delay!"); }, 1000000);

    
    }else if (latestForceData > 200 && listOfOkBubble.length != 0) {
      let selectokBubble = int (random (listOfOkBubble.length))
      b = listOfOkBubble.splice (selectokBubble, 1)
      setTimeout(() => {  pop2.play(); bubbles[b].changeImage ('badBubble'); }, 10)
      // bubbles[b].changeImage ('badBubble');
      // pop2.play();
      sleep(100)
    }

    drawSprites(bubbles);
    
  }
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function modeSelect1 () {
  mode = 1;
}

function modeSelect2 () {
  mode = 2;
}