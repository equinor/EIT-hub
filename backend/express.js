/* istanbul ignore file */

const express = require('express');

function start(port) {
    const app = express();

    app.use(express.static('public'));

    app.listen(port, () => console.log(`EIT Hub is listening at http://localhost:${port}`));
}

module.exports.start = start;
