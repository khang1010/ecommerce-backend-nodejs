const { Types } = require("mongoose")
const productModel = require("../product-model")
const {product, clothing, electronic, furniture} = require("../product-model")
const { getSelectData, getUnSelectData } = require("../../utils")

const publishProductByShop = async ({product_shop, product_id}) => {
    const foundProduct = await productModel.product.findOne({
        _id: new Types.ObjectId(product_id),
        product_shop: new Types.ObjectId(product_shop)
    })
    if (!foundProduct) return null

    foundProduct.isDraft = false
    foundProduct.isPublished = true

    const {modifiedCount} = await foundProduct.updateOne(foundProduct)
    return modifiedCount
}

const unPublishProductByShop = async ({product_shop, product_id}) => {
    const foundProduct = await productModel.product.findOne({
        _id: new Types.ObjectId(product_id),
        product_shop: new Types.ObjectId(product_shop)
    })
    if (!foundProduct) return null

    foundProduct.isDraft = true
    foundProduct.isPublished = false

    const {modifiedCount} = await foundProduct.updateOne(foundProduct)
    return modifiedCount
}

const searchProductsByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch);
    return await productModel.product.find({
        isPublished: true,
        $text: {
            $search: regexSearch
        },
    }, {score: {$meta: "textScore"}}).sort({score: { $meta: "textScore" }}).lean()
}

const findAllProducts = async ({query, limit, skip}) => {
    return await productModel.product.find(query)
    .populate("product_shop", "name email -_id")
    .skip(skip)
    .limit(limit)
    .sort({createdAt: -1})
    .lean().exec()
}

const getAllProductsByUser = async ({limit, page, sorted, filter, select}) => {
    return await productModel.product.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sorted === 'ctime' ? {_id: -1} : {_id: 1})
    .select(getSelectData(select))
    .lean()
}

const getProductById = async (product_id, select) => {
    return await productModel.product.findById(product_id).select(getUnSelectData(select));
}

const updateProductById = async (product_id, model, payload) => {
    return await model.findByIdAndUpdate(product_id, payload, {new: true})
}

module.exports = {
    findAllProducts,
    publishProductByShop,
    unPublishProductByShop,
    searchProductsByUser,
    getAllProductsByUser,
    getProductById,
    updateProductById,
}