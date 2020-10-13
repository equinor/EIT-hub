# EIT-hub

The goal of EIT-Hub help development of IoT prototypes. By removing some of the annoying not fun stuff. This first MVP have goal of removing 3 hassle: 

1. Gui.
2. Security. 
3. Communication.

## Status

Right now EIT hub is a bit off a mess. We are in a learning state and there have been a few experiments, false starts and dead ends. 

## Install dependencies

1. Backend: `npm install`
2. Devices: This project uses [Python Poetry](https://python-poetry.org/docs/#installation). It needs to be installed as shown in the link. No further knowledge of Poetry is needed. After Poetry has been installed, all other Python dependencies may be installed using `poetry install`.

## Run Fake Shuttle Controller

The Fake Shuttle Controller is used to test features without being physically connected to the shuttle.
To run everything on local machine, you need two terminals:

1. The first terminal should be in the root directory of the project. `npm start` will start the server.
2. The second terminal should be in the ./devices/Shuttle directory. To run the fake shuttle controller, use `poetry run fake`.
3. The frontend can be accessed on <http://localhost:3000/>
