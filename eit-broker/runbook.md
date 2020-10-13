# Install EIT Broker

PS this guide is from memory from the first time I installed.
Must make it better next time i need to install it.

## High level overview
1. Get a Ubuntu 18 computer or VM
2. Build VerneMQ
3. Setup permissions.
4. Setup protocols.
5. Setup TLS

## Get a Ubuntu 18 computer or VM
This guide was run on azure vm with:
* Operating system: Linux (ubuntu 18.04)
* Size: Standard B2ms (2 vcpus, 8 GiB memory)
* Username: verne

You need ssh access to the computer at least.

## Build VerneMQ
See verne readme for guide: https://github.com/vernemq/vernemq/

1. Install Erlang: https://computingforgeeks.com/how-to-install-latest-erlang-on-ubuntu-linux/
2. Install required software: 
`sudo apt intall build-essential make libssl-dev libsnappy-dev git`
3. Git clone the soruce. Preferable into vernemq-src.
`git clone https://github.com/vernemq/vernemq.git vernemq-src`
4. cd into source folder:
`cd vernemq-src`
5. Build it all:
`make rel` If it fails most likely you are missing an library to the apt get.
6. Move the self contained build out to your home dir:
`mv ./_build/default/rel/vernemq ~/vernemq`
7. `cd ~/vernemq`

## Setup permissions.
Main doc: https://docs.vernemq.com/configuration/file-auth

1. Create `./etc/vmq.acl` with the same content as [vmq.acl](vmq.acl).
2. Create `./etc/vmq.passwd` based on [vmq.passwd](vmq.passwd). Remember to set new passwords.
3. Run `./bin/vmq-passwd -U ./etc/vmq.passwd` to hash all the passwords in the file.

## Setup protocols.
Around line 238 in the config file change/add:
```
listener.tcp.default = 0.0.0.0:1883
listener.ssl.default = 0.0.0.0:8883
listener.ws.default = 0.0.0.0:8080
listener.wss.default = 0.0.0.0:8443
```
To add all the ports and protocols.

## Setup TLS
I need todo this again to give a exact guide.
1. Give your VM a domain name.
2. Make sure port 80 is open.
3. Download lets encrypt tooling.
4. Create cert.
5. Copy certs to ./certs
6. chown to local user.
7. Find and sett configuration.
```
listener.ssl.cafile = ./cert/fullchain.pem
listener.wss.cafile = ./cert/fullchain.pem

listener.ssl.certfile = ./cert/fullchain.pem
listener.wss.certfile = ./cert/fullchain.pem

listener.ssl.keyfile = ./cert/privkey.pem
listener.wss.keyfile = ./cert/privkey.pem
```

## Finally run
1. Open up port 8883 and 8443 to the world.
2. Run `./bin/vernemq start`

And it may just work. MAY.