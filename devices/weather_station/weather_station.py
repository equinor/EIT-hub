#!/usr/bin/env python3

"""
Script for sending weather data from an raspberry pi with enviro shield 
to an Azure IoT Hub
"""

import time
from bme280 import BME280

try:
    from smbus2 import SMBus
except ImportError:
    from smbus import SMBus

import logging

logging.basicConfig(
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

logging.info(' Temperature | Pressure | Humidity')

bus = SMBus(1)
bme280 = BME280(i2c_dev=bus)

while True:
    temperature = bme280.get_temperature()
    pressure = bme280.get_pressure()
    humidity = bme280.get_humidity()

    logging.info(
        ' {:05.2f} *C | {:05.2f} hPa | {:05.2f} %'
        .format(temperature, pressure, humidity)
    )

    time.sleep(1)