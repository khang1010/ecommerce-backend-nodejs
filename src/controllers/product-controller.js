'use strict';

const { CreatedResponse, OkResponse } = require("../core/success-response");
const { createProduct, getAllDraftsForShop, getAllPublishesForShop, publishProductByShop, unPublishProductByShop, searchProductsByUser, getAllProductsByUser, getProductById, updateProduct } = require("../services/product-service-xxx");

class ProductController {
    static createProduct = async (req, res, next) => {
        new CreatedResponse({
            message: "Create product successfully",
            metadata: await createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    static updateProduct = async (req, res, next) => {
        new CreatedResponse({
            message: "Update product successfully",
            metadata: await updateProduct(req.body.product_type, req.params.product_id, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

    static getAllDraftsForShop = async (req, res, next) => {
        new OkResponse({
            message: "Get all draft products successfully",
            metadata: await getAllDraftsForShop({product_shop: req.user.userId})
        }).send(res);
    }

    static getAllPublishesForShop = async (req, res, next) => {
        new OkResponse({
            message: "Get all publish products successfully",
            metadata: await getAllPublishesForShop({product_shop: req.user.userId})
        }).send(res);
    }

    static publishProductByShop = async (req, res, next) => {
        new OkResponse({
            message: "Publish product successfully",
            metadata: await publishProductByShop({product_shop: req.user.userId, product_id: req.params.id})
        }).send(res);
    }

    static unPublishProductByShop = async (req, res, next) => {
        new OkResponse({
            message: "Unpublish product successfully",
            metadata: await unPublishProductByShop({product_shop: req.user.userId, product_id: req.params.id})
        }).send(res);
    }

    static searchProductsByUser = async (req, res, next) => {
        new OkResponse({
            message: "Search products successfully",
            metadata: await searchProductsByUser({keySearch: req.params.keySearch})
        }).send(res);
    }

    static getAllProductsByUser = async (req, res, next) => {
        new OkResponse({
            message: "Get all products successfully",
            metadata: await getAllProductsByUser(req.query)
        }).send(res);
    }

    static getProductById = async (req, res, next) => {
        new OkResponse({
            message: "Get product by id successfully",
            metadata: await getProductById({product_id: req.params.product_id})
        }).send(res);
    }
}

module.exports = ProductController;