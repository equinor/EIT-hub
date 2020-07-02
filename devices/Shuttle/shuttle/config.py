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
