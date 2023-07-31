'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys' 

// Declare the Schema of the Mongo model
var apiKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0', '1', '2']

    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);