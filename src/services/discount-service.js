'use strict';

const { BadRequestError } = require("../core/error-response");
const discountModel = require("../models/discount-model");
const { findDiscountByCode, getAllDiscountCodesUnselect } = require("../models/repositories/discount");
const { convertToObjectId } = require("../utils");

class DiscountService {
    static async createDiscount(payload) {
        const {
            name, description, code, value, shop, max_uses, max_uses_per_user, user_used, type, start_date, end_date, uses_count,
            min_order_value, is_active, apply_to, products
        } = payload;
        if (new Date(start_date) > new Date(end_date)) throw BadRequestError('Start date must be before end date');
        const foundDiscount = await findDiscountByCode({ code, shop: convertToObjectId(shop) });
        if (foundDiscount) throw BadRequestError('Discount code already exists');

        return await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_code: code,
            discount_value: value,
            discount_shop: convertToObjectId(shop),
            discount_max_uses: max_uses,
            discount_max_uses_per_user: max_uses_per_user,
            discount_user_used: user_used,
            discount_type: type,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_uses_count: uses_count,
            discount_min_order_value: min_order_value,
            discount_is_active: is_active,
            discount_apply_to: apply_to,
            discount_products: products
        })
    }

    static async getProductsApplyDiscount({ limit = 50, page = 1, sorted = 'ctime', code, shopId, userId }) {
        
    }

    static async getDiscountCodesOfShop({ limit = 50, page = 1, sorted = 'ctime', shopId, userId }) {
        return await getAllDiscountCodesUnselect({ limit, page, sorted, unselect: ['__v'], filter: {
            discount_shop: convertToObjectId(shopId),
            discount_is_active: true,
        } });
    }
}

module.exports = DiscountService