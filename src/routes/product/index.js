const express = require('express');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

router.use(authentication);


module.exports = router;