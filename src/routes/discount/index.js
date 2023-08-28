const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const DiscountController = require('../../controllers/discount-controller');
const { authenticationV2 } = require('../../auth/authUtils');

const router = express.Router();

router.use(authenticationV2)
router.post('', asyncHandler(DiscountController.createDiscount));
router.get('/codes', asyncHandler(DiscountController.getAllDiscountCodesOfShop));

module.exports = router;