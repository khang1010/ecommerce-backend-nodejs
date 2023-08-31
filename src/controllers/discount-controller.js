'use strict';

const { CreatedResponse, OkResponse } = require("../core/success-response");
const DiscountService = require("../services/discount-service");

class DiscountController {
    static createDiscount = async (req, res, next) => {
        new CreatedResponse({
            message: "Create discount successfully",
            metadata: await DiscountService.createDiscount({
                ...req.body,
                shop: req.user.userId
            })
        }).send(res);
    }

    static updateDiscount = async (req, res, next) => {
        new CreatedResponse({
            message: "Update discount successfully",
            metadata: await DiscountService.updateDiscount({discount_id: req.params.discount_id, payload: req.body})
        }).send(res);
    }

    static getAllDiscountCodesOfShop = async (req, res, next) => {
        new OkResponse({
            message: "get all discount codes successfully",
            metadata: await DiscountService.getDiscountCodesOfShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res);
    }

    static getProductsApplyDiscount = async (req, res, next) => {
        new OkResponse({
            message: "get products apply discount successfully",
            metadata: await DiscountService.getProductsApplyDiscount({
                ...req.query,
            })
        }).send(res);
    }

    static deleteDiscountCode = async (req, res, next) => {
        new OkResponse({
            message: "delete discount code successfully",
            metadata: await DiscountService.deleteDiscountCode({
                ...req.query,
                shopId: req.user.userId,
            })
        }).send(res);
    }

    static cancelDiscountCode = async (req, res, next) => {
        new OkResponse({
            message: "cancel discount code successfully",
            metadata: await DiscountService.cancelDiscountCode({
                ...req.query,
                shopId: req.user.userId,
            })
        }).send(res);
    }

    static getDiscountAmount = async (req, res, next) => {
        new OkResponse({
            message: "get discount amount successfully",
            metadata: await DiscountService.getDiscountAmount({
                ...req.query,
                products: req.body.products,
            })
        }).send(res);
    }
}

module.exports = DiscountController