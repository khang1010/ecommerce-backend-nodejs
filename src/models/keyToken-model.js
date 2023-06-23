const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
var keyTokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:'Shop'
    },
    publicKey:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:Array,
        default: []
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);