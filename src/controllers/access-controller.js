const { CreatedResponse, OkResponse } = require('../core/success-response');
const AccessService = require('../services/access-service');

class AccessController {
  static handleRefreshToken = async (req, res, next) => {
    new OkResponse({
      message: 'Get new tokens successfully',
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  }

  static logOut = async (req, res, next) => {
    new OkResponse({
      message: 'Logout successfully',
      metadata: await AccessService.logOut(req.keyStore),
    }).send(res);
  }
  
  static logIn = async (req, res, next) => {
    new OkResponse({
      message: 'Login successfully',
      metadata: await AccessService.logIn(req.body),
    }).send(res);
  }

  static signUp = async (req, res, next) => {
    new CreatedResponse({
      message: 'User created successfully',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
    // return res.status(201).json(await AccessService.signUp(req.body));
  };
}

module.exports = AccessController;
