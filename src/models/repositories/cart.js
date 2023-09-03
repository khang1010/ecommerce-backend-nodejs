'use strict';

const cartModel = require("../cart-model");

const createUserCart = async ({ userId, product }) => {
    const query = {cart_userId: userId},
    updateOrInsert = {
        $addToSet: {
            cart_products: product
        },
        $inc: {
            cart_count_products: product.quantity
        }
    }, options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
}

const updateProductQuantityInCart = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
    },
    updateSet = {
        $inc: {
            cart_count_products: quantity,
            'cart_products.$.quantity': quantity,

        }
    }, options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
}

const deleteProductInCart = async ({userId, product}) => {
    const query = {
        cart_userId: userId,
        cart_state: 'active'
    }, updateSet = {
        $pull: {
            cart_products: {
                productId: product.productId
            }
        },
        $inc: {
            cart_count_products: -product.quantity
        }
    }, options = { upsert: true, new: true };

    return await cartModel.updateOne(query, updateSet, options);
}

const getUserCart = async (userId) => {
    return await cartModel.findOne({ cart_userId: +userId }).lean();
}

// const addProductToCart = async (userId, product) => {
//     const query = {
//         cart_userId: userId,
//         cart_state: 'active'
//     }, updateSet = {
//         $push: {
//             cart_products: product
//         },
//         $inc: {
//             cart_count_products: product.quantity
//         }
//     }, options = { upsert: true, new: true };

//     return await cartModel.updateOne(query, updateSet, options);
// }

module.exports = {
    createUserCart,
    updateProductQuantityInCart,
    deleteProductInCart,
    getUserCart,
    // addProductToCart,
}