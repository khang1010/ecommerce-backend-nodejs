const { getSelectData, getUnSelectData } = require("../../utils");
const discountModel = require("../discount-model")

const findDiscountByCode = async ({code, shopId}) => {
    const foundDiscount = await discountModel.findOne({
        discount_code: code,
        discount_shop: shopId
    }).lean();

    return foundDiscount
}

const getAllDiscountCodesUnselect = async ({limit, page, filter, unselect, sorted}) => {
    return await discountModel.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sorted === 'ctime' ? {_id: -1} : {_id: 1})
    .select(getUnSelectData(unselect))
    .lean()
}

const getAllDiscountCodesSelect = async ({limit, page, filter, select, sorted}) => {
    return await discountModel.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sorted === 'ctime' ? {_id: -1} : {_id: 1})
    .select(getSelectData(select))
    .lean()
}

const deleteDiscountCode = async ({code, shopId}) => {
    return await discountModel.findByIdAndDelete({
        discount_code: code,
        discount_shop: shopId,
    })
}

const updateDiscountCode = async ({update, discountId}) => {
    return await discountModel.findOneAndUpdate(discountId, update)
}

module.exports = {
    findDiscountByCode,
    getAllDiscountCodesSelect,
    getAllDiscountCodesUnselect,
    deleteDiscountCode,
    updateDiscountCode,
}