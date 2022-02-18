const express = require("express");
const routes = require('./route');
const app = express();

app
    // Use a logger
    .use((req, resp, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    })

    .use(express.json())
    .use('/v1/feedme', routes);

module.exports = app;
