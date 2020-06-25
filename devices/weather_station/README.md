# Weather Station 

Simple script that reads weather data (Temperature, Pressure and Humidity) from an enviro shield on a raspberry pi, and sends it to an Azure IoT Hub. 

## How to use

1. Install the dependencies in requirements.txt  
2. Create a .env file that contains the connection string for the IoT hub with the key "CONNECTION_STRING"  
3. Run weather_station.py
4. Use methods from backend or azure:
     1. SetInterval   int(+)    Set the interval you want to send messages (seconds)  
     2. SetParameter  int(1-4)  Set if you want to see all thre parameters or just one specific
     3. SetTempFactor float(+)  Set the compensating factor for the temperature sensor depening on device used/where the temp sensor is in realtion to the CPU or other           heating elements                      
     4. Reboot activatees on int payload = 1 For this to be usefull you will need to set weather_station.py to start on startup
      
