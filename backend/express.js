const express = require('express');

function start(port) {
    const app = express();

    app.get('/', (req, res) => res.send('Hello World!'));

    app.listen(port, () => console.log(`EIT Hub is listening at http://localhost:${port}`));
}

module.exports.start = start;