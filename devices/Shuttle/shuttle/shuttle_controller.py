import asyncio
import logging
from time import time
from shuttle import config
from shuttle.websocket_connector import WebsocketConnector
from shuttle.shuttle_connector import ShuttleConnector, FakeShuttleConnector


logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.DEBUG)


class DesiredThrust(dict):
    '''
    Specialized dict that handles async updates with tailored default values and has timestamps on updates
    '''

    def __init__(self):
        super().__init__({
            'x': 0,
            'y': 0,
            'z': 500,
            'r': 0,
        })
        self.timestamp: float = 0

    async def update_desired_thrust(self, x: int = 0, y: int = 0, z: int = 500, r: int = 0) -> None:
        self['x'] = x
        self['y'] = y
        self['z'] = z
        self['r'] = r
        self.timestamp = time()
        logging.debug('Desired thrust %d updated to: %d %d %d %d' % (id(self),x,y,z,r))

    def thrust_should_be_reset(self):
        return abs(self.timestamp - time()) > config.THRUST_TIME_LIMIT


def periodic_task(delay: float):
    ''' Decorator that makes a function run every <delay> seconds '''
    def periodic_task_decorator(func):
        async def wrapper(*args, **kwargs):
            while True:
                await func(*args, **kwargs)
                await asyncio.sleep(delay)
        return wrapper
    return periodic_task_decorator


@periodic_task(config.PILOT_CMD_DELAY)
async def thrust_sender(shuttle: ShuttleConnector, desired_thrust: DesiredThrust):
    '''
    Sends desired thrust to ardusub at given interval. 
    '''
    logging.debug('Desired thrust %d sent as: %d %d %d %d' % (
        id(desired_thrust),
        desired_thrust['x'], 
        desired_thrust['y'], 
        desired_thrust['z'], 
        desired_thrust['r']
    ))
    await shuttle.send_thrust_command(
        desired_thrust['x'], 
        desired_thrust['y'], 
        desired_thrust['z'], 
        desired_thrust['r'], 
    )


@periodic_task(config.HEARTBEAT_DELAY)
async def heartbeat(shuttle: ShuttleConnector):
    ''' 
    Send a heartbeat to ardusub every <delay> seconds 
    '''
    await shuttle.send_heartbeat()


@periodic_task(config.THRUST_RESET_DELAY)
async def thrust_resetter(desired_thrust: DesiredThrust):
    ''' 
    Sets desired thrust to neutral if no new commands are recieved within timelimit.
    '''
    if desired_thrust.thrust_should_be_reset:
        await desired_thrust.update_desired_thrust()  # default params are neutral
        logging.debug('Desired thrust %d has been reset' % id(desired_thrust))



async def input_listener(websocket_connector: WebsocketConnector, desired_thrust: DesiredThrust):
    logging.debug('Input listener has desired thrust id %d' % id(desired_thrust))
    await websocket_connector.thrust_input_handler(desired_thrust)


def quick_test():

    shuttle = ShuttleConnector(config.MAVLINK_CONNECTION_STRING)
    desired_thrust: dict = {
        'x': 0,
        'y': 0,
        'z': 500,
        'r': 100,
    }

    async def main():
        await asyncio.gather(
            thrust_sender(shuttle, desired_thrust),
            heartbeat(shuttle)
        )

    asyncio.run(main())


def control_over_websocket():

    shuttle = ShuttleConnector(config.MAVLINK_CONNECTION_STRING)
    websocket_connector = WebsocketConnector()

    desired_thrust = DesiredThrust()
    logging.debug(desired_thrust)
    
    async def main():
        await asyncio.gather(
            websocket_connector.thrust_input_handler(desired_thrust.update_desired_thrust),
            thrust_resetter(desired_thrust),
            thrust_sender(shuttle, desired_thrust),
            heartbeat(shuttle)
        )

    asyncio.run(main())


def fake_test():
    shuttle = FakeShuttleConnector(config.MAVLINK_CONNECTION_STRING)
    websocket_connector = WebsocketConnector()

    desired_thrust = DesiredThrust()
    logging.debug(desired_thrust)
    
    async def main():
        await asyncio.gather(
            input_listener(websocket_connector, desired_thrust),
            thrust_resetter(desired_thrust),
            thrust_sender(shuttle, desired_thrust),
            heartbeat(shuttle)
        )

    asyncio.run(main())


if __name__ == "__main__":
    fake_test()
