import json
import asyncio
import logging
from time import sleep
from shuttle.config import MAVLINK_CONNECTION_STRING, IOTHUB_CONNECTION_STRING
from shuttle.shuttle_connector import create_mavlink_connection, send_thrust_command, log_data
from shuttle.websocket_connector import consumer_handler

logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)


def periodic_task(delay: float):
    def periodic_task_decorator(func):
        async def wrapper(*args, **kwargs):
            while True:
                await func(*args, **kwargs)
                await asyncio.sleep(delay)
        return wrapper
    return periodic_task_decorator


def quick_test():

    # establish connection to shuttle over mavlink
    mavcon = create_mavlink_connection(MAVLINK_CONNECTION_STRING)
    log_data(mavcon)

    # define shorthand function for sending thrust commands
    def thrust(x=0, y=0, z=500, r=0):
        send_thrust_command(mavcon, x, y, z, r)

    @periodic_task(delay=1)
    async def rotate():
        thrust(r=100)

    @periodic_task(delay=1)
    async def heartbeat():
        logging.info('This log entry pretends to be a heartbeat')

    async def main():
        await asyncio.gather(
            rotate(),
            heartbeat()
        )


def keyboard_control():
    '''
    Lets a user control the shuttle directly from the topside computer through keyboard commands
    '''

    # establish connection to shuttle over mavlink
    mavcon = create_mavlink_connection(MAVLINK_CONNECTION_STRING)

    # define shorthand function for sending thrust commands
    def thrust(x=0, y=0, z=500, r=0):
        send_thrust_command(mavcon, x, y, z, r)

    # wait for keyboard commands until termination
    while True:

        key = input('waiting for command..\n')

        if key == 'w':
            thrust(x=100)

        elif key == 'a':
            thrust(y=-100)

        elif key == 's':
            thrust(x=-100)

        elif key == 'd':
            thrust(y=100)

        elif key == 'q':
            thrust(r=-100)

        elif key == 'e':
            thrust(r=100)

        elif key == 'z':
            thrust(z=-100)

        elif key == 'x':
            thrust(z=100)
        
        else:
            print('Invalid key pressed.\n Control with wasd, qe and zx')



def control_over_websocket():

    @periodic_task(delay=1)
    async def hello():
        logging.info('hello')

    async def main():

        # establish connection to shuttle over mavlink
        mavcon = create_mavlink_connection(MAVLINK_CONNECTION_STRING)

        # TODO: retrieve websocket uri over IoT Hub
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

        await asyncio.gather(
            consumer_handler(uri, thrust_message_consumer),
            hello()
        )


    try: 
        # run all incomming messages through the consumer function
        asyncio.run(main())

    except:
        logging.error('An exception occured')
        pass    # TODO: error handling


if __name__ == "__main__":

    async def main():
        
        @periodic_task(delay=1)
        async def hello() -> None:
            logging.info('hello')

        @periodic_task(2)
        async def there() -> None:
            logging.info('there')

        await asyncio.gather(
            hello(),
            there()
        )

    asyncio.run(main())
