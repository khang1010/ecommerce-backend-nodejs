'use strict';
const os = require('os');
const process = require('process');
const { default: mongoose } = require("mongoose")

const _SECONDS = 5000
// count connections
const checkConnections = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numConnections}`);
}
// check overload connections
const checkOverloads = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // Example max connections
        const maxConnections = numCores * 5;
        console.log(`Number of connections: ${numConnections}`);
        console.log(`Number of cores: ${numCores}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        
        if (numConnections > maxConnections) {
            console.log('Max connections exceeded');
        }
    }, _SECONDS)
}

module.exports = {
    checkConnections,
    checkOverloads
}