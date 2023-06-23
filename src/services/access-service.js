'use strict';

const shopModels = require("../models/shop-models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createKeyToken } = require("./keyToken-service");
const { createTokenPair } = require("../auth/authUtils");
const RoleShop = {
    shop: "shop",
    writer: "writer",
}

class AccessService {

    static signUp = async ({name, email, password}) => {
        try {
            // check email exists
            const holderShop = await shopModels.findOne({email}).lean();
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'User already exists',
                    status: 'error'
                }
            }
            // create password hash by bcrypt
            const passwordHash = await bcrypt.hash(password, 10);
            // create new shop
            const newShop = await shopModels.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.shop]
            })
            if (newShop) {
                // create private and public key
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type:'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type:'pkcs1',
                        format: 'pem'
                    }
                })

                const publicKeyString = await createKeyToken({
                    userId: (await newShop)._id,
                    publicKey
                })
                
                if (!publicKeyString) {
                    return {
                        code: 'xxx',
                        message: 'Failed to create public key string',
                        status: 'error'
                    }
                }

                // const publicKeyObject = crypto.createPublicKey(publicKeyString);
                // create token pair: access and refresh token
                const tokenPair = await createTokenPair({userId: (await newShop)._id, name, email, password}, publicKey, privateKey);
                // console.log(`created token pair: ${tokenPair}`);
                // console.log(`public key: ${publicKey} \n private key: ${privateKey}`);
                return {
                    code:'201',
                    status:'success',
                    metadata: {
                        message: 'User created successfully',
                        shop: newShop,
                        tokenPair,
                    },
                }
            }
            return {
                code: 'xxx',
                message: 'Failed to create user',
                status: 'error',
                metadata: null
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService