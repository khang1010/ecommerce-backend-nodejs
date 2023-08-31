const { getSelectData, getUnSelectData } = require("../../utils");
const discountModel = require("../discount-model")

const findDiscountByCode = async ({code, shopId}) => {
    const foundDiscount = await discountModel.findOne({
        discount_code: code,
        discount_shop: shopId
    }).lean();

    return foundDiscount
}

const findDiscountById = async (discountId) => {
    return await discountModel.findById(discountId).lean();
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
    return await discountModel.findOneAndDelete({
        discount_code: code,
        discount_shop: shopId,
    })
}

const updateDiscountCode = async (discountId, update) => {
    return await discountModel.findByIdAndUpdate(discountId, update, {new: true})
}

const cancelDiscountCode = async ({codeId, userId}) => {
    return await discountModel.findByIdAndUpdate(codeId, {
        $pull: {
            discount_user_used: userId,
        },
        $inc: {
            discount_uses_count: -1,
            discount_max_uses: 1,
        }
    })
}

module.exports = {
    findDiscountByCode,
    getAllDiscountCodesSelect,
    getAllDiscountCodesUnselect,
    deleteDiscountCode,
    updateDiscountCode,
    cancelDiscountCode,
    findDiscountById,
}