'use strict';

const { BadRequestError } = require('../core/error-response');
const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product-model');
const {
  findAllProducts,
  publishProductByShop,
  searchProductsByUser,
  getAllProductsByUser,
  getProductById,
  updateProductById,
} = require('../models/repositories/product');
const { updateNestedObject, removeUndefinedObject } = require('../utils');

class ProductFactory {
  static productRegistry = {};

  static registerProduct(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const classRef = ProductFactory.productRegistry[type];
    if (!classRef) throw new BadRequestError(`Invalid product type: ${type}`);

    return new classRef(payload).createProduct();
  }

  static async updateProduct(type, product_id, payload) {
    const classRef = ProductFactory.productRegistry[type];
    if (!classRef) throw new BadRequestError(`Invalid product type: ${type}`);

    return new classRef(payload).updateProduct(product_id);
  }

  // PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // END PUT

  // QUERY
  static async getAllDraftsForShop({ product_shop, limit = 60, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllProducts({ query, limit, skip });
  }

  static async getAllPublishesForShop({ product_shop, limit = 60, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllProducts({ query, limit, skip });
  }

  static async searchProductsByUser({ keySearch }) {
    return await searchProductsByUser({ keySearch });
  }

  static async getAllProductsByUser({ limit = 60, page = 1, sorted = 'ctime', filter = { isPublished: true } }) {
    return await getAllProductsByUser({ limit, page, sorted, filter, select: ['product_name', 'product_price', 'product_thumb'] });
    
  }

  static async getProductById({ product_id, select = ['__v'] }) {
    console.log("===> product_id: ", product_id);
    return await getProductById(product_id, select);
  }

  // END QUERY
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }

  async updateProduct(product_id, payload) {
    return await updateProductById(product_id, product, payload);
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('create clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('create product error');

    return newProduct;
  }

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);
    if (payload.product_attributes) {
      await updateProductById(product_id, clothing, updateNestedObject(removeUndefinedObject(payload.product_attributes)));
    }
    
    const updateProduct = await super.updateProduct(product_id, updateNestedObject(payload));
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError('create electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('create product error');

    return newProduct;
  }

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);
    if (payload.product_attributes) {
      await updateProductById(product_id, electronic, updateNestedObject(removeUndefinedObject(payload.product_attributes)));
    }
    
    const updateProduct = await super.updateProduct(product_id, updateNestedObject(payload));
    return updateProduct;
  }
}

class Furnitures extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('create furniture error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('create product error');

    return newProduct;
  }

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);
    if (payload.product_attributes) {
      await updateProductById(product_id, furniture, updateNestedObject(removeUndefinedObject(payload.product_attributes)));
    }
    
    const updateProduct = await super.updateProduct(product_id, updateNestedObject(payload));
    return updateProduct;
  }
}

ProductFactory.registerProduct('clothing', Clothing);
ProductFactory.registerProduct('electronic', Electronics);
ProductFactory.registerProduct('furniture', Furnitures);

module.exports = ProductFactory;
