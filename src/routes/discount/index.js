const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const DiscountController = require('../../controllers/discount-controller');
const { authenticationV2 } = require('../../auth/authUtils');

const router = express.Router();
router.get('/products', asyncHandler(DiscountController.getProductsApplyDiscount));
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount));

router.use(authenticationV2)
router.post('', asyncHandler(DiscountController.createDiscount));
router.patch('/:discount_id', asyncHandler(DiscountController.updateDiscount));
router.get('/codes', asyncHandler(DiscountController.getAllDiscountCodesOfShop));
router.post('/delete', asyncHandler(DiscountController.deleteDiscountCode));
router.post('/cancel', asyncHandler(DiscountController.cancelDiscountCode));

module.exports = router;