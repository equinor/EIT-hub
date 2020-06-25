#!/usr/bin/env python3

"""
Script for sending weather data from an raspberry pi with enviro shield 
to an Azure IoT Hub
"""

import settings
import os
import time, logging
import threading
from azure.iot.device import IoTHubDeviceClient, Message, MethodResponse
from bme280 import BME280


# set up something for the enviro
bme280 = BME280()

# The time between weather updates
UPDATE_PERIOD = 1  # in seconds

# Choosing what parameters we want to send
PARAMETER = 1

# Factor for tuning the cpu compensated temperature
FACTOR = 1.5

# if 1 the system will reboot
RESTART = 0

# The device connection string to authenticate the device with your IoT hub.
# Using the Azure CLI:
# az iot hub device-identity show-connection-string --hub-name {YourIoTHubName} --device-id MyNodeDevice --output table
CONNECTION_STRING = settings.CONNECTION_STRING

# create a client object for the IoT Hub
client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)

# define the format of the json string that will be sent to the hub as a message
# Func for switching json string
def json_format(argument):
    switcher = {
        1: '{{"temperature": {temperature}, " pressure": {pressure}, "humidity": {humidity}}}',
        2: '{{"temperature": {temperature}}}', 
        3: '{{"pressure": {pressure}}}',
        4: '{{"humidity": {humidity}}}'
    }
    return switcher.get(argument)
    
MSG_TXT = json_format(PARAMETER)

# Inserting to the json string depending on the parameter chosen   
def msg_add_values(argument, temperature, pressure, humidity):
    global MSG_TXT
    if argument == 1:
        return MSG_TXT.format(temperature=temperature, pressure=pressure, humidity=humidity)
    elif argument == 2:
        return MSG_TXT.format(temperature=temperature)
    elif argument == 3:
        return MSG_TXT.format(pressure=pressure)
    elif argument == 4:    
        return MSG_TXT.format(humidity=humidity)
    else:
        print("Ivalid")
    
    
# Used in comp_temp()
def get_cpu_temperature():
    with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
        temp = f.read()
        temp = int(temp) / 1000.0
    return temp

cpu_temps = [get_cpu_temperature()] * 5 

# Compensating the temperature so it is "more correct"
def comp_temp():
    global cpu_temps
    cpu_temp = get_cpu_temperature()
    cpu_temps = cpu_temps[1:] + [cpu_temp]
    avg_cpu_temp = sum(cpu_temps) / float(len(cpu_temps))
    raw_temp = bme280.get_temperature()
    comp_temp = raw_temp - ((avg_cpu_temp - raw_temp) / FACTOR)
    return comp_temp

# Reading and checking the payload 
def Read_and_check(variable, msg_payload, name):
    try:
        value = variable(msg_payload)
    except ValueError:   
        response_payload = {"Response": "Invalid parameter"}
        response_status = 400
    else:
        response_payload = {"Response": "Executed direct method {}".format(name)}
        response_status = 200  
    return (value, response_payload, response_status)

# Method listener running on a different thread   
def method_listener(device_client):
    global PARAMETER, UPDATE_PERIOD, FACTOR, RESTART
    while True:
        method_request = device_client.receive_method_request()
        print (
                "\nMethod callback:\nmethodName = {method_name}\npayload = {payload}".format(
                method_name=method_request.name,
                payload=method_request.payload
                )
            )
        if method_request.name == "SetInterval":
            UPDATE_PERIOD, response_payload, response_status = Read_and_check(int, method_request.payload, method_request.name) 
        elif method_request.name == "SetParameter":
            PARAMETER, response_payload, response_status = Read_and_check(int, method_request.payload, method_request.name)
        elif method_request.name == "SetTempFactor":
            FACTOR, response_payload, response_status = Read_and_check(float, method_request.payload, method_request.name)
        elif method_request.name == "Reboot":
            RESTART, response_payload, response_status = Read_and_check(int, method_request.payload, method_request.name)
        else:
            response_payload = {"Response": "Direct method {} not defined".format(method_request.name)}
            response_status = 404
        
        method_response = MethodResponse(method_request.request_id, response_status, payload=response_payload)
        device_client.send_method_response(method_response)


def main():
    global MSG_TXT
    """ Initiation"""
    
    # set up logging 
    logging.basicConfig(
        level=logging.INFO,
        datefmt='%Y-%m-%d %H:%M:%S')

    logging.info(' Temperature | Pressure | Humidity')

    # Start a thread to listen 
    device_method_thread = threading.Thread(target=method_listener, args=(client,))
    device_method_thread.daemon = True
    device_method_thread.start()

     
    prev_time = int(time.time())

    """ Send telemetry loop """
    while True:  

        # if statement so the loop won't sleep 
        if int(time.time()) >= prev_time + UPDATE_PERIOD:
            prev_time = int(time.time())

            # get new readings from the sensors 
            temperature = comp_temp()
            pressure = bme280.get_pressure()
            humidity = bme280.get_humidity()

            logging.info(
                ' {:05.2f} *C | {:05.2f} hPa | {:05.2f} %'
                .format(temperature, pressure, humidity)
            )

            # create message and sent it to hub 
            MSG_TXT = json_format(PARAMETER)
            message = Message(
                msg_add_values(PARAMETER, temperature, pressure, humidity)
            )
            client.send_message(message)

        if RESTART == 1:
           os.system('sudo reboot')

        


if __name__ == '__main__':

    try:
        main()
       
    except KeyboardInterrupt:
        logging.info('Program stopped by keyboardInterrupt')
