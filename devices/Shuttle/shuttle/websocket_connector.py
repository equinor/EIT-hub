import asyncio
import websockets
import logging
import json


async def json_to_dict(message: str) -> dict:
    try:
        content = json.loads(message)
        return content
    except ValueError:
        logging.exception('Incomming message has invalid json format')


class WebsocketConnector:

    def __init__(self):
        # TODO: get uri form iot hub
        self.uri: str = 'ws://localhost:3000/'

    async def input_handler(self, consumer) -> None:
        try:
            async with websockets.connect(self.uri) as websocket:
                logging.info('Listening for websocket messages..')
                async for message in websocket:
                    await consumer(message)
        except websockets.ConnectionClosed:
            logging.error('lost connection to websocket')

    async def thrust_input_handler(self, desired_thrust) -> None:

        async def consumer(message):
            cmds: dict = await json_to_dict(message)
            cmd_list = cmds.values()
            logging.debug('Recieved thrust message: ' + str(cmd_list))
            await desired_thrust.update_desired_thrust(*cmd_list)

        await self.input_handler(consumer)


if __name__ == "__main__":

    async def printer(message):
        logging.info('message: ' + str(message))

    async def main():
        websocket_connector = WebsocketConnector()
        await websocket_connector.input_handler(printer)

    asyncio.run(main())
