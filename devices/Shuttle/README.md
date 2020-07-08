# Shuttle

Shuttle is a package that enables control of a ROV running ArduSub. It uses pymavlink to establish the connection and to send commands.

## Setup and running

1. Change the connection string in `config.py` depending on the setup. See http://mavlink.io/en/mavgen_python/ for documentation  
2. Install dependencies and run using poetry 
```
poetry install
poetry run test
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
