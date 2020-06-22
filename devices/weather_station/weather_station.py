#!/usr/bin/env python3

"""
Script for sending weather data from an raspberry pi with enviro shield 
to an Azure IoT Hub
"""

import settings
import time, logging
from azure.iot.device import IoTHubDeviceClient, Message
from bme280 import BME280
try:
    from smbus2 import SMBus
except ImportError:
    from smbus import SMBus


# The device connection string to authenticate the device with your IoT hub.
# Using the Azure CLI:
# az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id MyNodeDevice --output table
CONNECTION_STRING = settings.CONNECTION_STRING

# define the format of the json string that will be sent to the hub as a message
MSG_TXT = '{{"temperature": {temperature}, " pressure": {pressure}, humidity": {humidity}}}'


def main():

    """ Initiation"""

    # set up something for the enviro TODO: find out what does this does
    bus = SMBus(1)
    bme280 = BME280(i2c_dev=bus)

    # create a client object for the IoT Hub
    client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)
    
    # set up logging 
    logging.basicConfig(
        level=logging.INFO,
        datefmt='%Y-%m-%d %H:%M:%S')

    logging.info(' Temperature | Pressure | Humidity')


    """ Send telemetry loop """

    while True:

        # get new readings from the sensors 
        temperature = bme280.get_temperature()
        pressure = bme280.get_pressure()
        humidity = bme280.get_humidity()

        logging.info(
            ' {:05.2f} *C | {:05.2f} hPa | {:05.2f} %'
            .format(temperature, pressure, humidity)
        )

        # create message and sent it to hub 
        message = Message(
            MSG_TXT.format(temperature=temperature, pressure=pressure, humidity=humidity)
        )
        client.send_message(message)

        time.sleep(60)


if __name__ == '__main__':

    try:
        main()

    except KeyboardInterrupt:
        logging.info(' Program stopped by keyboardInterrupt')