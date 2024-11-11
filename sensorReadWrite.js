// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
let log = console.log
import { Gpio } from 'onoff';

// log(Gpio)

const led = new Gpio(17, 'out');
// log("led", led)
const button = new Gpio(4, 'in', 'both')
// log("button", button)

// button.watch((err, value) => {
//   // log("err",err)
//   log("value",value)
//   led.writeSync(value)
// });

// Function to control the LED (on or off)
function controlLED(status) {
  try {
    console.log("Led status", status);
    if (status === 'on') {
      led.writeSync(1); // Turn LED on
      console.log("LED is ON");
    } else if (status === 'off') {
      led.writeSync(0); // Turn LED off
      console.log("LED is OFF");
    }
    return led.readSync()
  } catch (err) {
    console.error("Failed to read led data:", err);
  }
}


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGFwk8DwerP7GZdhh2HV0ABIjlSck-uGc",
  authDomain: "iot-sensor-f3c19.firebaseapp.com",
  databaseURL: "https://iot-sensor-f3c19-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-sensor-f3c19",
  storageBucket: "iot-sensor-f3c19.appspot.com",
  messagingSenderId: "646283652547",
  appId: "1:646283652547:web:a106c85fb1605a7f05a176",
  measurementId: "G-HT2TLZH1KJ"
};
// databaseURL: "http://192.168.0.189:9001",

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getDatabase(app);
const reference = ref(db, "sensors");

async function readSensorData() {
  try {
    // const res = await sensor.read(22, 4); // 22 is the type of DHT sensor, 4 is the GPIO pin
    console.log(`Temp:`);
    // log("controlLED('off')", controlLED('off'))

    // Send data to Firebase
    // Update Firebase with the LED status
    await set(reference, {
      status: controlLED('off'),
    });

    console.log("Data written to Firebase.");
  } catch (err) {
    console.error("Failed to read sensor data:", err);
  }
}

// const commandRef = ref(db, 'commands');
// const commandRef = firebase.database().ref('commands');
onValue(reference, (snapshot) => {
  const command = snapshot.toJSON();
  console.log("command", command.status);

  if (command.status === 'turn_on_light') {
    console.log(`Received command: ${command.status}`);
    controlLED('on')
  } else if (command.status === 'turn_off_light') {
    // led.writeSync(0); // Turn the LED off
    controlLED('off')
  }
});

// // Read sensor data every 5 seconds
// setInterval(readSensorData, 5000);
readSensorData()

