'use strict';
const { findById } = require('../services/apiKey-service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
};

const apiKey = async (req, res, next) => {
    try {
        // console.log('API key: ', req.headers[HEADER.API_KEY]);
        let key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error"
            })
        }
        
        const objKey = await findById(key);
        console.log(objKey);
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error"
            })
        }
        req.objKey = objKey
        return next();
    } catch (error) {
        
    } 
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions.includes(permission)) {
            return res.status(403).json({
                message: "Permission denied"
            })
        }
        return next();
    }
}

module.exports = {
    apiKey,
    permission
}