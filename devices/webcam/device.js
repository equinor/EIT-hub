const puppet = require("puppeteer");
const Mqtt = require("azure-iot-device-mqtt").Mqtt;
const DeviceClient = require("azure-iot-device").Client
const Message = require("azure-iot-device").Message;
require("dotenv").config();

var connectionString = process.env.CONNECTION_STRING;
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);
var SDP = null;
var browser = null;
var page = null;
var stat = false;

// Send mesasge to hub
function sendMessage(mess, type){
    var msg = new Message(JSON.stringify({mess: mess, type: type}));
    console.log("Sending " + type);

    client.sendEvent(msg, function (err) {
        if (err) {
          console.error("send error: " + err.toString());
        } else {
          console.log(type + " sent");
        }
      });
}

function directMethodResponse(err) {
    if (err) {
        console.error("Error when sending method response:\n" + err.toString());
    } else {
        console.log("Response to method \"" + request.methodName + "\" sent successfully.");
    }
}

// Sends stream status every ten seconds (bool)
function status(){
    sendMessage(stat, "Status");
    setTimeout(status, 10000);
}
status();

// Opens the browser and sends the device SDP back
async function startup() {
    console.log("Starting SDP exchange");

    browser = await puppet.launch({ args: ["--use-fake-ui-for-media-stream"] });    // args = approve for webcam access
    page = await browser.newPage();                                                
    await page.goto(__dirname + "/P2P/index.html");   // opens the P2Pstreaming 
    page.on('console', msg => SDP = msg.text()); // Reads the browser console output

    //Waiting for the SDP to load (varies with browser and hardware)
    while (SDP == null){        
        await page.waitFor(100);
    } 

    // Sending SDP as a message
    sendMessage(SDP, "SDP");

}

client.onDeviceMethod("getSDP", function (response){
    // Makes sure to restart if back end requests a new stream without closing the old one
    if (stat == false){
        startup.then(response.send(200, "Generated device SDP", directMethodResponse));
    } else {
        close.then(startup).then(response.send(200, "Generated device SDP", directMethodResponse));
    } 
});

// Submits the server SDP
async function submitSDP(request){

    await page.type("#incoming", request.payload);
    await page.click('[type="submit"]');
 
    console.log("Stream started"); 
    
    stat = true;
}

client.onDeviceMethod("submitSDP", function (response){
    submitSDP.then(response.send(200, "Submited SDP, Stream started", directMethodResponse));
});

// Closes the browser(and the stream)
async function close(){

    await page.close();
    await browser.close();

    page = null;
    browser = null;
    SDP = null;

    console.log("Stream closed");  
    stat = false;    
}

client.onDeviceMethod("Close", function (response){
    close.then(response.send(200, "Stream closed", directMethodResponse));
});

