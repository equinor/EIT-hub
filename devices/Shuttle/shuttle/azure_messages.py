from azure.iot.device import IoTHubDeviceClient
import json

class AzureMessageListener:

    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.device_client = IoTHubDeviceClient.create_from_connection_string(self.connection_string)

        self.device_client.connect()

    def message_listener(self):
        message = self.device_client.receive_message()  # blocking call
        jsonMsg = json.loads(message.data)
        return jsonMsg['url'], jsonMsg['authorization']
