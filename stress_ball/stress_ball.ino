#include <ArduinoBLE.h>

const int forcePin = A0;

//led
int red_light_pin= 2;
int green_light_pin = 3;
int blue_light_pin = 4;

BLEService ballService("d0421f1c-e415-4098-9702-804c0444067a"); // create service


// create button characteristic and allow remote device to get notifications
BLEByteCharacteristic forceCharacteristic("12a26502-15bd-4f84-94cc-da25072fd36d", BLERead | BLENotify);

void setup() {
 Serial.begin(9600);
//  while (!Serial); // wait until the serial port is open for debugging
  pinMode(forcePin, INPUT);
  pinMode(red_light_pin, OUTPUT);
  pinMode(green_light_pin, OUTPUT);
  pinMode(blue_light_pin, OUTPUT);

  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");

    while (1);
  }

  // set the local name peripheral advertises
  BLE.setLocalName("stressball");
  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(ballService);

  // add the characteristic to the service
  ballService.addCharacteristic(forceCharacteristic);

  // add the service
  BLE.addService(ballService);

  // initialize a value to send
  forceCharacteristic.writeValue(0);

  // start advertising
  BLE.advertise();

  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
   // poll for BLE events
  BLE.poll();

  // read the current button pin state
  int forceValue = analogRead(forcePin);
  //  Serial.println(forceValue);
  // has the value changed since the last read
  boolean forceChanged = false;

  if (forceCharacteristic.value() != forceValue){
    forceChanged = true;
  }

  if (forceChanged) {
    // reading state changed, update characteristic
    forceCharacteristic.writeValue(forceValue);
    Serial.println(forceValue);
  }

  if (forceValue > 100 && forceValue<200) {
    RGB_color(random(0, 255), random(0, 255), random(0, 255));
    delay(80);
  }
    if (forceValue > 200) {
    RGB_color(random(0, 255), random(0, 255), random(0, 255));
    delay(10);
  }
}

void RGB_color(int red_light_value, int green_light_value, int blue_light_value)
 {
  analogWrite(red_light_pin, red_light_value);
  analogWrite(green_light_pin, green_light_value);
  analogWrite(blue_light_pin, blue_light_value);
}
