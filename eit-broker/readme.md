# EIT-broker

EIT broker is a messaging service based on [VerneMQ](https://vernemq.com/) that handle communication between devices, backend services and browser based web apps.

Its compatible with most (all) MQTT clients configured with:
* MQTT over TLS on port 8883
* MQTT over WSS (Web Socket) on port 8443

## Getting running

Deployment have not been automated so please se our run book:
[Run book](runbook.md)

## How to connect

There are 3 users right now:
* browser for websites connections.
* device for IoT devices.
* service for backend services.

Have 2 topic prefixes
public/ for that all have read write to.
private/ for only device and service.

All other are blocked at this point.

Should just work with any MQTT client library. Tested:
* Rust: [rumqttc](https://docs.rs/rumqttc/0.1.1/rumqttc/) 
* JS/browser: [Eclipse Paho JavaScript Client](https://www.eclipse.org/paho/index.php?page=clients/js/index.php)

## Status
Experimental. Anything can change at any time.

Right now ve have started it and it looks god. The setup is very manual.

SLA is some effort. Its up when the developer wants it to be up.
Security level is cheap bike lock. Should be able to handle auto hacking scripts that run in the background. But open for bad actors. And have little to no separation.