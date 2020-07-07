"use strict";

const express = require('express');

/** The main function for Eit-Hub backend.
 *  We should not have js code directly in the file.
 */
function main() {
    const app = express();
    const port = 3000;

    app.get('/', (req, res) => res.send('Hello World!'));

    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
}

// Invoke main and starts the server
main();