const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');

const router = express.Router();

router.use(apiKey)
router.use(permission('0'))

router.use('/v1/api/product', require('./product/index'));
router.use('/v1/api/discount', require('./discount/index'));
router.use('/v1/api', require('./access/index'));

module.exports = router;