# EIT-hub

A IoT hub for experimentation for Emerging IT.

## Install dependencies

1. Backend: `npm install`
2. Devices: This project uses [Python Poetry](https://python-poetry.org/docs/#installation). It needs to be installed as shown in the link. No further knowledge of Poetry is needed. After Poetry has been installed, all other Python dependencies may be installed using `poetry install`.

## Run Fake Shuttle Controller

The Fake Shuttle Controller is used to test features without being physically connected to the shuttle.
To run everything on local machine, you need two terminals:

1. The first terminal should be in the root directory of the project. `npm start` will start the server.
2. The second terminal should be in the ./devices/Shuttle directory. To run the fake shuttle controller, use `poetry run fake`.
3. The frontend can be accessed on <http://localhost:3000/>
