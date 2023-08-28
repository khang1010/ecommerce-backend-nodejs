const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_description: String,
    product_price: {
        type: Number,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['electronic', 'clothing', 'furniture']
    },
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    product_slug: String,
    product_attributes: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"],
        set: (v) => Math.round(v * 10) / 10
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

productSchema.index({product_name: "text", product_description: "text"});

productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, {lower: true});
    next();
})

const clothingSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
}, {
    collection: 'Clothes',
    timestamps: true,
});

const electronicSchema = new mongoose.Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: String,
    color: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
}, {
    collection: 'Electronics',
    timestamps: true,
});

const furnitureSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
    material: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
}, {
    collection: 'Furnitures',
    timestamps: true,
});

//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronic: mongoose.model('Electronic', electronicSchema),
    furniture: mongoose.model('Furniture', furnitureSchema),
};