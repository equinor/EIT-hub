EIT-Hub Security
===========

Design goals
---
* No more hassle than is absolutely necessary.
* We are willing to trade a bit of security for a lot of usability.
* Options need to make sense and not be complicated.

### User management
* Support for Equinor and Guest users.
* Default is deny with an explicits allow list.
    * Have meta options like all Equinor Employees.
* All apps have 2 roles.
    * Maker. That can make changes to the app and administers the app.
        * There should be a way to have maker only dashboards/tabs. 
    * User. Normal users that can interact with applications.
* There is a global user list for app developer that can create new applications.

### Application security
* Applications running on the platform should be pre-authenticated and should get there key materials as part of application start.
* External application will need some kind of client id/secret to be able to talk to the platform.

### Device security
* The device only tells the platform and identification. The platform tells it what it is.
* A device must be requested to the platform before use. And be claimed by one or more applications.
* Use public private key for secure communication and authentication.
    * HSM is preferred if available.

Proposed onboarding:
1. On first boot device create a new private public key pair if no HSM.
2. Send a request to a public endpoint with the public key and metadata.
3. The device is now unclaimed in the ui and need to be claimed by a developer or application before it can do anything.
4. Platform starts telling the device what it needs todo. And any other keys get delivered.


MVP
---
* All equinor users are users off all apps.
* All applications are deployed with the platform so no extra security is needed.
* Device security is handles 100% by Azure IoT Hub.