import asyncio
import logging
from time import sleep
from shuttle.config import MAVLINK_CONNECTION_STRING, IOTHUB_CONNECTION_STRING
from shuttle.websocket_connector import input_handler, get_websocket_uri
from shuttle.shuttle_connector import (
    create_mavlink_connection, 
    send_thrust_command, 
    send_heartbeat,
    log_data
)


logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)


def periodic_task(delay: float):
    ''' 
    Decorator that makes a function run every <delay> seconds 
    '''
    def periodic_task_decorator(func):
        async def wrapper(*args, **kwargs):
            while True:
                await func(*args, **kwargs)
                await asyncio.sleep(delay)
        return wrapper
    return periodic_task_decorator


@periodic_task(delay=1)
async def thrust_sender(mavcon, desired_thrust: dict):
    '''
    Sends desired thrust to ardusub at given interval. 
    '''
    await send_thrust_command(
        mavcon,
        desired_thrust['x'], 
        desired_thrust['y'], 
        desired_thrust['z'], 
        desired_thrust['r'], 
    )


@periodic_task(delay=1)
async def heartbeat(mavcon):
    ''' 
    Send a heartbeat to ardusub every <delay> seconds 
    '''
    await send_heartbeat(mavcon)


def create_thrust_updater(desired_thrust: dict):
    ''' 
    Returns a function that can be used to update the desired thrust 
    '''
    async def update_desired_thrust(x: int, y: int, z: int, r: int):
        desired_thrust['x'] = x
        desired_thrust['y'] = y
        desired_thrust['z'] = z
        desired_thrust['r'] = r

    return update_desired_thrust


def quick_test():

    mavcon = create_mavlink_connection(MAVLINK_CONNECTION_STRING)
    uri = get_websocket_uri()
    desired_thrust: dict = {
        'x': 0,
        'y': 0,
        'z': 500,
        'r': 100,
    }

    async def main():
        await asyncio.gather(
            thrust_sender(mavcon, desired_thrust),
            heartbeat(mavcon)
        )

    asyncio.run(main())


def control_over_websocket():

    mavcon = create_mavlink_connection(MAVLINK_CONNECTION_STRING)
    uri = get_websocket_uri()
    desired_thrust: dict = {
        'x': 0,
        'y': 0,
        'z': 500,
        'r': 0,
    }

    async def main():
        await asyncio.gather(
            input_handler(uri, create_thrust_updater(desired_thrust)),
            thrust_sender(mavcon, desired_thrust),
            heartbeat(mavcon)
        )

    asyncio.run(main())
