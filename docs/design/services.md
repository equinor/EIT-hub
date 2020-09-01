EIT-Hub Services
===========

Design goals
---
* Services are application running in the cloud that work with user interfaces, devices and other systems.
* Self manged services are running somewhere else on the internet and talks to Eit Hub over an api link.
    * Needs to be registered with EitHub.
    * Need to exchange key material out of bound.
    * Library's for interaction should be created.
* Hosted Services will have more of Function as a service/serverless feel to them.
    * Built in editor would be nice.
    * Some kind of GitHub build pipeline.
    * Hosting and scaling manged by the platform.
    * Data storage:
        * Simple storage based on browsers local and session store.
        * The stores is synchronies between nodes running the same app.
        * LocalStore is a key value store that persists.
        * SessionStore is faster but may be lost at any time. (When the underlying platform needs to create a new version of database.)
    * Secure connections is handles by the platform.
    * Logging/monitoring is also handles by the platform for all it can see.
    * Node.js and Python runtime.



MVP
---
* Services are deployed as part of the Eit Hub.
* Self manged options is not available.
* Minimal first version of LocalStore store. SessionStore uses LocalStore.
* First pass at monitoring and logging.
* All is built and deployed together.
* Node.js only.