import os

# load user-made environment variables
from dotenv import load_dotenv
load_dotenv()


# String used for connection to azure iot hub
IOTHUB_CONNECTION_STRING = os.getenv('IOTHUB_CONNECTION_STRING')

# String used by pymavlink to connect with the ROV or simulator.
# Needs to be changed depending on the physical setup. Documentation: 
# http://mavlink.io/en/mavgen_python/
MAVLINK_CONNECTION_STRING = 'udpin:0.0.0.0:14550'

HEARTBEAT_DELAY = 1
PILOT_CMD_DELAY = 0.1
THRUST_RESET_DELAY = 0.5    # how often need for thrust reset is checked 
THRUST_TIME_LIMIT = 2       # how long before thrust should be reset to neutral
