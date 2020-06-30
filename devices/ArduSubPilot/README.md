# ArduSub Pilot

ArduSub Pilot is a package that enables control of a ROV running ArduSub. It uses pymavlink to establish the connection and to send commands.

Its main object is `DeviceController`, which connects to a device according to its connection string. Thrust commands can then be sent to the device with the `send_thrust_command` function.

## Setup and running

1. Change the connection string in `config.py` depending on the setup. See http://mavlink.io/en/mavgen_python/ for documentation  
2. Install dependencies and run using poetry 
```
poetry install
poetry run keyboard_control
```


## Using the ArduPilot simulator

Build the simulated device ([source](https://github.com/ArduPilot/ardupilot/blob/master/BUILD.md))

```
./waf configure --board sitl
./waf sub
```

Run the simulation

```
cd ardupilot/Tools/autotest
./sim_vehicle.py -v ArduSub -f vectored_6dof --console --map 
```
