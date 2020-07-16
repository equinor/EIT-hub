EIT-Hub Minium Viable Product
============================

The goal of EIT-Hub is to create a platform for hosting and development of IoT application. (And all the off label use we will use it for.) By removing some of the annoying not fun stuff. This first MVP have goal of removing 3 hazels: 

1. Gui.
2. Security. 
3. Communication.

Top level concepts
------------------

EIT-Hub have 2 top level concepts applications and modules.

### EIT-Module 
Modules are core part of EIT-Hub. They may not be the there own separate blocks of code. For this MVP will have 3 modules that correspond to the 3 hazels:
* Gui is browser based dashboard solution that lay out widgets and alow them to communicate using an event bus. Also give a nice simple no hazel to communicate with backend.

* Securely. Is not its own part per se but it makes sure that everything is encrypted and at least authenticated. And as long as you stay inside the platform you can know that everything is secure enoughs for Prof of concepts at least.

* Communications. A system for both how messages are moved and how they are defined with the hope of some reuse. The tech we use will be chosen for ease of use and firewall bustling potential not speed and performance. Will model event buses with topics you can listen for.

### EIT-Hub application
The top level unit in EIT-Hub is the app that can contain:
* Dashboards. Almost full pages canvases that can hold widgets from inside the application or form other applications.
* Widgets. Components that can be as simple as button to as complex as the whole of vscode.
* Services. Backend code running in the cloud that can talk to browsers and devices.
* Devices. You know software running on a PI somewhere. That can communicate wit services.

### EIT-Hub users

For this MVP the users will be the EIT team and few invited guests. The admin ui will be developer friendly as in no way user friendly. For this first version separation between applications is more of a nice to have and its assumed that everyone play nice. Or we will delete the code.
