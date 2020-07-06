import json
import asyncio
import logging
from shuttle.config import MAVLINK_CONNECTION_STRING, IOTHUB_CONNECTION_STRING
from shuttle.shuttle_connector import create_mavlink_connection, send_thrust_command
from shuttle.websocket_connector import consumer_handler


logger = logging.getLogger('controller')
logger.setLevel(logging.INFO)


def keyboard_control():
    '''
    Lets a user control the shuttle directly from the topside computer through keyboard commands
    '''

    # establish connection to shuttle over mavlink
    mavcon = create_mavlink_connection(MAVLINK_CONNECTION_STRING)

    # define shorthand function for sending thrust commands
    def thrust(x=0, y=0, z=0, r=0):
        send_thrust_command(mavcon, x=0, y=0, z=0, r=0)

    # wait for keyboard commands until termination
    while True:

        key = input('waiting for command..\n')

        if key == 'w':
            thrust(x=250)

        elif key == 'a':
            thrust(y=-250)

        elif key == 's':
            thrust(x=-250)

        elif key == 'd':
            thrust(y=250)

        elif key == 'q':
            thrust(r=-250)

        elif key == 'e':
            thrust(r=250)

        elif key == 'z':
            thrust(z=-250)

        elif key == 'x':
            thrust(z=250)
        
        else:
            print('Invalid key pressed.\n Control with wasd, qe and zx')



def control_over_websocket():

    # establish connection to shuttle over mavlink
    mavcon = create_mavlink_connection(MAVLINK_CONNECTION_STRING)

    # retrieve websocket uri over IoT Hub
    uri = 'ws://localhost:3000/'

    # define consumer function for incomming messages
    async def thrust_message_consumer(message: str):

        # unpack message
        msg = json.loads(message)

        # send thrust command
        try: 
            send_thrust_command(mavcon, msg['x'], msg['y'], msg['z'], msg['r'])
        except:
            # TODO: catch format errors
            pass


    try: 
        # run all incomming messages through the consumer function
        asyncio.run(consumer_handler(uri, thrust_message_consumer))

    except:
        logger.error('An exception occured')
        pass    # TODO: error handling
