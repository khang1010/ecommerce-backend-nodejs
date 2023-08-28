'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { NotFoundError, AuthenticationError } = require('../core/error-response');
const { findByUserId } = require('../services/keyToken-service');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify ${err}`)
            } else {
                console.log(`decode verify ${decode}`);
            }
        });

        return {accessToken, refreshToken}
    } catch (error) {
        return {
            message: "create token pair failed",
            error: error.message
        }        
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new NotFoundError("User not found")

    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError("Key not found")

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    console.log("AccessToken: ", accessToken)
    if (!accessToken) throw new AuthenticationError("Invalid Token")

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthenticationError("Invalid User")
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }

})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new NotFoundError("User not found")

    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError("Key not found")

    if (req.headers[HEADER.REFRESHTOKEN]) {
        const refreshToken = req.headers[HEADER.REFRESHTOKEN];
        try {
            const decodeUser = JWT.verify(refreshToken, keyStore.publicKey);
            if (userId !== decodeUser.userId) throw new AuthenticationError("Invalid User")
            req.keyStore = keyStore
            req.refreshToken = refreshToken
            req.user = decodeUser
            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    console.log("AccessToken: ", accessToken)
    if (!accessToken) throw new AuthenticationError("Invalid Token")

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthenticationError("Invalid User")
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }

})
const verifyJWT = async (token, publicKey) => {
    const decoded = await JWT.verify(token, publicKey);
    return decoded
}

module.exports = {
    createTokenPair,
    authentication,
    authenticationV2,
    verifyJWT,
}