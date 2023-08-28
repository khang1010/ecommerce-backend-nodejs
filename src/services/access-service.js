'use strict';

const shopModels = require('../models/shop-models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {
  createKeyToken,
  removeById,
  findByRefreshTokenUsed,
  deleteByUserId,
  findByRefreshToken,
  updateRefreshToken,
} = require('./keyToken-service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const {
  BadRequestError,
  ForbiddenError,
  AuthenticationError,
} = require('../core/error-response');
const { findByEmail } = require('./shop-service');
const RoleShop = {
  shop: 'shop',
  writer: 'writer',
};

class AccessService {
  static handleRefreshTokenV2 = async ({user, keyStore, refreshToken}) => {
    const {userId, email} = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await deleteByUserId(userId);
      throw new ForbiddenError('Something went wrong! Please try again');
    }
    
    if (!keyStore.refreshToken === refreshToken) {
      throw new AuthenticationError('Token is not valid');
    }

    const foundShop = await findByEmail(email);
    if (!foundShop) throw new AuthenticationError('Shop is not registered');

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await updateRefreshToken(refreshToken, tokens);

    return {
      user,
      tokens,
    };
  };

  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await findByRefreshTokenUsed(refreshToken);
    // console.log("found token", foundToken);
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.publicKey
      );
      await deleteByUserId(userId);
      throw new ForbiddenError('Something went wrong! Please try again');
    }

    const holderToken = await findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthenticationError('Token is not valid');
    // console.log("holder token", holderToken);

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.publicKey
    );

    const foundShop = await findByEmail(email);
    if (!foundShop) throw new AuthenticationError('Shop is not registered');

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // await holderToken.update({
    //   $set: {
    //     refreshToken: tokens.refreshToken,
    //   },
    //   $addToSet: {
    //     refreshTokenUsed: refreshToken,
    //   },
    // });
    await updateRefreshToken(refreshToken, tokens);

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logOut = async (keyStore) => {
    return await removeById(keyStore._id);
  };

  static logIn = async ({ email, password, refreshToken = null }) => {
    const foundShop = findByEmail(email);
    if (!foundShop) throw BadRequestError('User not found');
    const isMatch = await bcrypt.compare(password, (await foundShop).password);
    if (!isMatch) throw BadRequestError('Wrong password');

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });

    const tokens = await createTokenPair(
      { userId: (await foundShop)._id, email },
      publicKey,
      privateKey
    );

    await createKeyToken({
      userId: (await foundShop)._id,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: await foundShop,
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // check email exists
    const holderShop = await shopModels.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('User already exists');
    }
    // create password hash by bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    // create new shop
    const newShop = await shopModels.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.shop],
    });
    if (newShop) {
      // create private and public key
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      });

      // create token pair: access and refresh token
      const tokenPair = await createTokenPair(
        { userId: (await newShop)._id, name, email },
        publicKey,
        privateKey
      );

      const publicKeyString = await createKeyToken({
        userId: (await newShop)._id,
        privateKey,
        publicKey,
        refreshToken: tokenPair.refreshToken,
      });

      if (!publicKeyString) {
        throw new BadRequestError('Failed to create public key string');
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);

      return {
        shop: newShop,
        tokenPair,
      };
    }

    throw new BadRequestError('Failed to create user');
  };
}

module.exports = AccessService;
