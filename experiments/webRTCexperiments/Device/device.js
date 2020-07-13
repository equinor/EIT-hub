const puppet = require("puppeteer");
const Mqtt = require("azure-iot-device-mqtt").Mqtt;
const DeviceClient = require("azure-iot-device").Client
require("dotenv").config();

var connectionString = process.env.CONNECTION_STRING;
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);
var SDP = null;
var browser = null;
var page = null;

// Opens the browser and sends the device SDP back
async function startup(request, response) {
    console.log("Starting SDP exchange");

    browser = await puppet.launch({ args: ["--use-fake-ui-for-media-stream"] });    // args = approve for webcam access
    page = await browser.newPage();                                                
    await page.goto("C:\\Users\\User\\...\\index.html#1");   // opens the P2Pstreaming sample(download form git and give appropriate path)
    page.on('console', msg => SDP = msg.text()); // Reads the browser console output

    //Waiting for the SDP to load (varies with browser and hardware)
    while (SDP == null){        
        await page.waitFor(100);
    } 

    function directMethodResponse(err) {
        if (err) {
            console.error("Error when sending method response:\n" + err.toString());
        } else {
            console.log("Response to method \"" + request.methodName + "\" sent successfully.");
        }
    }

    // Sending desc using the payload in the resonse 
    response.send(200, SDP, directMethodResponse);    

}

client.onDeviceMethod("getSDP", startup);

// Submits the server SDP
async function submitSDP(request, response){

    await page.type("#incoming", request.payload);
    await page.click('[type="submit"]');

    function directMethodResponse(err) {
        if (err) {
            console.error("Error when sending method response:\n" + err.toString());
        } else {
            console.log("Response to method \"" + request.methodName + "\" sent successfully.");
        }
    }

    response.send(200, "Submited SDP, Stream started", directMethodResponse); 
    console.log("Stream started");   
}

client.onDeviceMethod("submitSDP", submitSDP);

// Closes the browser(and the stream)
async function close(request, response){

    await page.close();
    await browser.close();

    page = null;
    browser = null;
    SDP = null;

    function directMethodResponse(err) {
        if (err) {
            console.error("Error when sending method response:\n" + err.toString());
        } else {
            console.log("Response to method \"" + request.methodName + "\" sent successfully.");
        }
    }

    response.send(200, "Stream closed", directMethodResponse);
    console.log("Stream closed");      
}

client.onDeviceMethod("Close", close);