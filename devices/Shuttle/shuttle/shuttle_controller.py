import json
from shuttle.config import MAVLINK_CONNECTION_STRING, IOTHUB_CONNECTION_STRING
from shuttle.shuttle_connector import create_mavlink_connection, send_thrust_command
from shuttle.websocket_connector import create_websocket_client, consumer_handler


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
    uri = 'tmptest'

    # establish conneciton to backend over websocket
    websocket = create_websocket_client(uri)


    # define consumer function for incomming messages
    async def thrust_message_consumer(message: str):

        # unpack message
        msg = json.loads(message)

        # send thrust command
        send_thrust_command(mavcon, msg['x'], msg['y'], msg['z'], msg['r'])


    try: 
        # run all incomming messages through the consumer function
        consumer_handler(websocket, thrust_message_consumer)

    except:
        pass    # TODO: error handling

    finally:
        websocket.close()
