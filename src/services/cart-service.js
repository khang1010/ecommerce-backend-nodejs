'use strict';

const { NotFoundError } = require("../core/error-response");
const { createUserCart, getUserCart, deleteProductInCart, updateProductQuantityInCart } = require("../models/repositories/cart");
const { getProductById } = require("../models/repositories/product");

class CartService {
    static async addToCart({ userId, product }) {
        const userCart = await getUserCart(userId);
        if (!userCart) {
            return await createUserCart({ userId, product });
        }

        if (!userCart.cart_count_products) {
            return await createUserCart({ userId, product });
        }

        return await updateProductQuantityInCart({ userId, product });
    }

    static async updateProductQuantityInCart({ userId, shop_orders }) {
        const {shopId, products} = shop_orders[0];
        const {productId, quantity, oldQuantity} = products[0];
        const foundProduct = await getProductById(productId, []);
        if (!foundProduct) throw new NotFoundError('Product is not belong to this shop');
        if (foundProduct.product_shop.toString() !== shopId) throw new NotFoundError('Product is not belong to this shop');

        if (!quantity) return await deleteProductInCart({ userId, product: products[0] });

        return await updateProductQuantityInCart({ userId, product: {
            productId,
            quantity: quantity - oldQuantity,
        } });
    }

    static async getUserCart(userId) {
        return await getUserCart(userId);
    }

    static async deleteProductInCart({ userId, product }) {
        return await deleteProductInCart({ userId, product });
    }
}

module.exports = CartService;