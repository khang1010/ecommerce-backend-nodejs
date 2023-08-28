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

    static getAllDiscountCodesOfShop = async (req, res, next) => {
        new OkResponse({
            message: "get all discount codes successfully",
            metadata: await DiscountService.getDiscountCodesOfShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res);
    }
}

module.exports = DiscountController