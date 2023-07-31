'use strict';

const keyTokenModel = require('../models/keyToken-model');
const {Types} = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const publicKeyString = publicKey.toString('hex');
      // const tokens = await keyTokenModel.create({
      //     user: userId,
      //     publicKey: publicKeyString
      // })
      const filter = { user: userId };
      const update = {
        privateKey: privateKey.toString('hex'),
        publicKey: publicKeyString,
        refreshToken,
      };
      const tokens = keyTokenModel.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      });

      return tokens ? (await tokens).publicKey : null;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
  }

  static removeById = async (id) => {
    return await keyTokenModel.findByIdAndDelete(id);
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken}).lean();
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken});
  }

  static updateRefreshToken = async (refreshToken, tokens) => {
    return await keyTokenModel.updateOne({refreshToken}, {
      $set: { refreshToken: tokens.refreshToken },
      $addToSet: { refreshTokenUsed: refreshToken },
    })
  }

  static deleteByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  }
}

module.exports = KeyTokenService;
