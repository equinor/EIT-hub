EIT-Hub Devices
===========

Design goals
---
* Simple python, node-js library / runtime that handle:
    * Security and connectively.
    * Remote development and setup.
* The device software should only care about sending and getting messages.
* Devices are calmed bu applications.
* One physical deice may have multiple logical devices.
* Bindings for common systems like ROS, ROS2

MVP
---
* Python only.
* Provisioning happens with Azure IoT.
* Communications over Azure IoT and WebSocket only.