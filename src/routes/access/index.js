const express = require('express');
const { signUp, logIn, logOut, handleRefreshToken } = require('../../controllers/access-controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

router.post('/shop/signup', asyncHandler(signUp));
router.post('/shop/login', asyncHandler(logIn));

router.use(authentication)
router.post('/shop/logout', asyncHandler(logOut));
router.post('/shop/handleRefreshToken', asyncHandler(handleRefreshToken));

module.exports = router;