#!/usr/bin/env python3

import os
from dotenv import load_dotenv

# load contents of env file into system environment
load_dotenv()

# load desired variables from system environment
CONNECTION_STRING = os.getenv('CONNECTION_STRING')