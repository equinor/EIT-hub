from azure.iot.device import IoTHubDeviceClient, Message
import json

class AzureMessages:

    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.device_client = IoTHubDeviceClient.create_from_connection_string(self.connection_string)

        self.device_client.connect()

    def message_listener(self):
        '''Listens for all messages sent to the shuttle from the Azure IoT Hub.
        Returns a'''
        while True:
            message = self.device_client.receive_message()  # blocking call
            jsonMsg = json.loads(message.data)
            if 'url' in jsonMsg and 'authorization' in jsonMsg:
                return jsonMsg['url'], jsonMsg['authorization']

    def send_message(self, message_type, message_data):
        message = Message(message_data)
        message.message_id = message_type
        self.device_client.send_message(message)