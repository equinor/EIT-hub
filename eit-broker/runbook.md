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

