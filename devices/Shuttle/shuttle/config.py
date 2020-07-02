import os

# load user-made environment variables
from dotenv import load_dotenv
load_dotenv()

# String used by pymavlink to connect with the ROV or simulator.
# Needs to be changed depending on the physical setup. Documentation: 
# http://mavlink.io/en/mavgen_python/
CONNECTION_STRING = 'udpin:0.0.0.0:14550'
