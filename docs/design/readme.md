EIT-Hub Minium Viable Product
============================

The goal of EIT-Hub help development of IoT prototypes. By removing some of the annoying not fun stuff. This first MVP have goal of removing 3 hassle: 

1. Gui.
2. Security. 
3. Communication.

Top level concepts
------------------

EIT-Hub have 2 top level concepts applications and modules.

### EIT-Hub Module 
Modules are core part of EIT-Hub. They may not be the there own separate blocks of code. For this MVP will have 3 modules that correspond to the 3 hazels:

* **Gui** is a browser based dashboard solution. Using predefined widgets that communicate over an event bus. With easy communications with backend.

* **Security**s goal is to be as secure as possible with little to no hassle. You should not be temped to apply an allow everything hack.

* **Communication** is based on both well defined and custom messages. There the module will handle the most locked down and impolite networks. No more weeks of hacking to bypass a corporate firewall for a small demo.

### EIT-Hub application
EIT-Hub is an application platform. So the top level unit is an application. That can contain zero or more of:

* **Dashboards** a grid you can lay out widgets. Your own or from other apps. Every dashboard will also have an event bus for inter widget communication on the same page.

* **Widget** custom tags that can be composed similar to AFrame. Will have some isolation to enable use of crazy tech and solutions.

* **Services** server code that can comminate with both browser widgets and devices. And can also do everything a normal server can.

* **Devices**. Use a simple SDK to bring your PI online. Can communicate over both an always on and a realtime link.

User of EIT-Hub
---------------

For this MVP the users will be the EIT team and few invited guests. The admin ui will be developer friendly as in no way user friendly. For this first version separation between applications is more of a nice to have and its assumed that everyone play nice. Or we will delete the code.
