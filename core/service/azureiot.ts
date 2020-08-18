
/** A wrapper and simplification over Azure IoT for EitHubs needs.
 * Assumes that all messages are json.
 * 
 * This is the only part of the code that can use Azure IoT apis. Add method as needed.
 */
import {Client} from 'azure-iothub';
import {Message} from "azure-iot-common";
import { EventHubConsumerClient } from "@azure/event-hubs";
import Config from './config';

export default class AzureIot {
    private _onMessageCallbacks: Map<string, any[]> = new Map();
    private iotHubClient: Client | undefined;
    private eventHubConsumer: EventHubConsumerClient | undefined;

    constructor(private config: Config) {
        this._onMessageCallbacks = new Map();
        if (this.config.iotHubConnectionString !== "") {
            this.iotHubClient = Client.fromConnectionString(this.config.iotHubConnectionString);
        }
        if (this.config.eventHubConnectionString !== "") {
            this.eventHubConsumer = new EventHubConsumerClient("$Default", this.config.eventHubConnectionString);
        }
    }

    /** Try to send a message to a device. If the device do not exist then it will be dropped.
     * 
     * @param {string} deviceName
     * @param {any} jsonObject
     * @returns {boolean} If there was nowhere to send to.
     */
    public sendMessage(deviceName: string, jsonObject: any): boolean {
        if (this.iotHubClient) {

            const message = new Message(JSON.stringify(jsonObject));
            message.messageId = 'c2d';
            console.log(`Sending message to ${deviceName} with payload:\n`, message.getData())
            this.iotHubClient.send(deviceName, message, function (err) {
                if (err) {
                    return false;
                } else {
                    return true;
                }
            });
        } else {
            console.warn('You have not specified an IoT Hub connection string.')
        }
        return false;
    }

    /** Register a callback for used with device.
     * 
     * @param {string} deviceName
     * @param {Function} callback called with a js object with the message from device as argument.
     */
    public onMessage(deviceName: string, callback: any): void {
        if (this._onMessageCallbacks.has(deviceName)) {
            this._onMessageCallbacks.get(deviceName)!.push(callback);
        } else {
            this._onMessageCallbacks.set(deviceName, [callback]);
        }
    }

    public start(): void {
        if (this.config.eventHubConnectionString !== "") {

            const _processMessage = async (messages: any) => {
                for (const message of messages) {
                    const deviceName = message.systemProperties['iothub-connection-device-id'];
                    for (const callback of this._onMessageCallbacks.get(deviceName) ?? []) {
                        callback(message);
                    }
                }
            };

            const _processError = async function (err: any) {
                console.log(err);
            };

            // Subscribe to messages from all partitions as below
            this.eventHubConsumer?.subscribe({
                processEvents: _processMessage,
                processError: _processError
            });
        } else {
            console.warn('You have not specified an Event Hubs connection string.')
        }
    }
}