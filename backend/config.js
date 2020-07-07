"use strict";

const dotenv = require('dotenv');

const defaultConf = Object.freeze({
    port: 3000
});

function applyEnv(processEnv, base = defaultConf){
    let envConf = {};
    if(processEnv.EITHUB_PORT) {
        envConf.port = parseInt(processEnv.EITHUB_PORT);
    }

    return Object.freeze({
        ...base,
        ...envConf
    })
}

function main() {
    // Run dotenv to populate process.env from .env.
    dotenv.config();

    // apply setting from environment over default
    return applyEnv(process.env);
}

module.exports = {
    defaultConf: defaultConf,
    applyEnv: applyEnv,
    main: main
}
