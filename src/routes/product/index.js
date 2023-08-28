const express = require('express');
const { authenticationV2 } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const {
  createProduct,
  getAllDraftsForShop,
  getAllPublishesForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
  getAllProductsByUser,
  getProductById,
  updateProduct,
} = require('../../controllers/product-controller');

const router = express.Router();

router.get('/:keySearch', asyncHandler(searchProductsByUser));
router.get('', asyncHandler(getAllProductsByUser))
router.get('/id/:product_id', asyncHandler(getProductById))

router.use(authenticationV2);
router.post('', asyncHandler(createProduct));
router.patch('/:product_id', asyncHandler(updateProduct));
router.get('/drafts/all', asyncHandler(getAllDraftsForShop));
router.get('/publishes/all', asyncHandler(getAllPublishesForShop));
router.post('/publishes/:id', asyncHandler(publishProductByShop));
router.post('/drafts/:id', asyncHandler(unPublishProductByShop));

module.exports = router;
