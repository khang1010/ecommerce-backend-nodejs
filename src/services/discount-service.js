'use strict';

const { BadRequestError, NotFoundError } = require("../core/error-response");
const discountModel = require("../models/discount-model");
const productModel = require("../models/product-model");
const { findDiscountByCode, getAllDiscountCodesUnselect, updateDiscountCode, deleteDiscountCode, cancelDiscountCode, findDiscountById } = require("../models/repositories/discount");
const { getAllProductsByUser } = require("../models/repositories/product");
const { convertToObjectId, removeUndefinedObject, updateNestedObject } = require("../utils");
const ProductFactory = require("./product-service-xxx");

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

    static async updateDiscount({discount_id, payload}) {
        return await updateDiscountCode(discount_id, updateNestedObject(removeUndefinedObject(payload)));
    }

    static async getProductsApplyDiscount({ limit = 50, page = 1, sorted = 'ctime', discountId, userId }) {
        const foundDiscount = await findDiscountById(convertToObjectId(discountId));
        if (!foundDiscount) throw NotFoundError('Discount code not found');

        if (foundDiscount.discount_apply_to === 'all') {
            return await ProductFactory.getAllPublishesForShop({ product_shop: foundDiscount.discount_shop, limit, skip: (page - 1) * limit });
        } else if (foundDiscount.discount_apply_to === 'specific') {
            return await getAllProductsByUser({ limit, page, sorted, filter: {
                _id: { $in: foundDiscount.discount_products },
                isPublished: true,
            }, select: ['product_name', '_id']})
        }

        return [];
    }

    static async getDiscountCodesOfShop({ limit = 50, page = 1, sorted = 'ctime', shopId, userId }) {
        return await getAllDiscountCodesUnselect({ limit, page, sorted, unselect: ['__v'], filter: {
            discount_shop: convertToObjectId(shopId),
            discount_is_active: true,
        } });
    }

    static async deleteDiscountCode({code, shopId}) {
        return await deleteDiscountCode({code, shopId: convertToObjectId(shopId)});
    }

    static async cancelDiscountCode({code, shopId, userId}) {
        const foundDiscount = await findDiscountByCode({ code, shop: convertToObjectId(shopId) });
        if (!foundDiscount) throw new NotFoundError('Discount code not found');

        return await cancelDiscountCode({codeId: foundDiscount._id, userId});
    }

    static async getDiscountAmount({discountId, userId, products}) {
        const foundDiscount = await findDiscountById(convertToObjectId(discountId));
        if (!foundDiscount) throw new NotFoundError('Discount code not found');

        if (!foundDiscount.discount_is_active) throw new BadRequestError('Discount code is not active');
        if (!foundDiscount.discount_max_uses) throw new BadRequestError('Discount code is out');
        if (new Date() < new Date(foundDiscount.discount_start_date) || new Date() > new Date(foundDiscount.discount_end_date)) throw new BadRequestError('Discount code is expired');

        let totalCost = products.reduce((acc, product) => acc + product.product_price * product.product_quantity, 0);
        if (foundDiscount.discount_min_order_value > totalCost) throw new BadRequestError('Total cost must be greater than or equal to minimum order value');
        let amount = foundDiscount.discount_type === 'fixed_amount' ? foundDiscount.discount_value : totalCost/100 * foundDiscount.discount_value;

        if (foundDiscount.discount_max_uses_per_user > 0) {
            //...
        }
        return {
            totalCost,
            discount: amount,
            finalCost: totalCost - amount,
        }
    }
}

module.exports = DiscountService