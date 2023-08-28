const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const instanceMongoDb = require('./dbs/init-mongodb');
const { checkConnections, checkOverloads } = require('./helpers/check-connection');
require('dotenv').config();
const app = express();

// init middleware
app.use(morgan("dev")) // show details request package
app.use(helmet()) // hide some information package
app.use(compression()) // reduce memory usage package
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init routes
app.use('/', require('./routes/index'))

// init database
instanceMongoDb
// checkOverloads()

// handle error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        message: error.message,
        stack: error.stack,
        status: statusCode,
    })
})

module.exports = app
