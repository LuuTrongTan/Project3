const { Product, Category } = require('../../models');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');

/**
 * Lấy danh sách sản phẩm với phân trang, sắp xếp và lọc
 * @param {Object} queryParams - Tham số truy vấn
 * @returns {Object} Danh sách sản phẩm
 */
const getAllProducts = async (queryParams) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const offset = (page - 1) * limit;
  const sortBy = queryParams.sortBy || 'createdAt';
  const sortOrder = queryParams.sortOrder || 'DESC';
  
  // Filtering
  const filter = {};
  
  if (queryParams.search) {
    filter.name = { [Op.iLike]: `%${queryParams.search}%` };
  }
  
  if (queryParams.status) {
    filter.status = queryParams.status;
  }
  
  if (queryParams.minPrice) {
    filter.price = { ...filter.price, [Op.gte]: queryParams.minPrice };
  }
  
  if (queryParams.maxPrice) {
    filter.price = { ...filter.price, [Op.lte]: queryParams.maxPrice };
  }
  
  if (queryParams.sellerId) {
    filter.sellerId = queryParams.sellerId;
  }
  
  const { count, rows: products } = await Product.findAndCountAll({
    where: filter,
    limit,
    offset,
    order: [[sortBy, sortOrder]],
    include: [
      {
        model: Category,
        as: 'categories',
        through: { attributes: [] }
      }
    ]
  });
  
  return {
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    products
  };
};

/**
 * Lấy thông tin sản phẩm theo ID
 * @param {number} productId - ID của sản phẩm
 * @returns {Object} Thông tin sản phẩm
 */
const getProductById = async (productId) => {
  const product = await Product.findByPk(productId, {
    include: [
      {
        model: Category,
        as: 'categories',
        through: { attributes: [] }
      }
    ]
  });
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return product;
};

/**
 * Tạo sản phẩm mới
 * @param {Object} productData - Dữ liệu sản phẩm
 * @param {number} userId - ID của người tạo (admin/seller)
 * @returns {Object} Thông tin sản phẩm đã tạo
 */
const createProduct = async (productData, userId) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      name,
      description,
      price,
      salePrice,
      quantity,
      images,
      status,
      categoryIds,
      specifications,
      attributes
    } = productData;
    
    const product = await Product.create({
      name,
      description,
      price,
      salePrice,
      quantity,
      images,
      status: status || 'inactive',
      specifications,
      attributes,
      sellerId: userId
    }, { transaction });
    
    // Associate categories if provided
    if (categoryIds && categoryIds.length > 0) {
      const categories = await Category.findAll({
        where: { id: { [Op.in]: categoryIds } },
        transaction
      });
      
      if (categories.length > 0) {
        await product.setCategories(categories, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Fetch product with categories
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] }
        }
      ]
    });
    
    return createdProduct;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Cập nhật thông tin sản phẩm
 * @param {number} productId - ID của sản phẩm
 * @param {Object} productData - Dữ liệu cập nhật
 * @param {number} userId - ID của người cập nhật
 * @param {string} userRole - Vai trò của người cập nhật
 * @returns {Object} Thông tin sản phẩm đã cập nhật
 */
const updateProduct = async (productId, productData, userId, userRole) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      name,
      description,
      price,
      salePrice,
      quantity,
      images,
      status,
      categoryIds,
      specifications,
      attributes
    } = productData;
    
    const product = await Product.findByPk(productId, { transaction });
    
    if (!product) {
      await transaction.rollback();
      throw new Error('Product not found');
    }
    
    // Check if user is admin or the seller of the product
    if (userRole !== 'admin' && product.sellerId !== userId) {
      await transaction.rollback();
      throw new Error('Not authorized to update this product');
    }
    
    // Update fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (salePrice !== undefined) product.salePrice = salePrice;
    if (quantity !== undefined) product.quantity = quantity;
    if (images !== undefined) product.images = images;
    if (status !== undefined) product.status = status;
    if (specifications !== undefined) product.specifications = specifications;
    if (attributes !== undefined) product.attributes = attributes;
    
    await product.save({ transaction });
    
    // Update categories if provided
    if (categoryIds && categoryIds.length > 0) {
      const categories = await Category.findAll({
        where: { id: { [Op.in]: categoryIds } },
        transaction
      });
      
      if (categories.length > 0) {
        await product.setCategories(categories, { transaction });
      }
    }
    
    await transaction.commit();
    
    // Fetch updated product with categories
    const updatedProduct = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] }
        }
      ]
    });
    
    return updatedProduct;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Xóa sản phẩm (đánh dấu không hoạt động)
 * @param {number} productId - ID của sản phẩm
 * @param {number} userId - ID của người xóa
 * @param {string} userRole - Vai trò của người xóa
 * @returns {boolean} Kết quả xóa
 */
const deleteProduct = async (productId, userId, userRole) => {
  const transaction = await sequelize.transaction();
  
  try {
    const product = await Product.findByPk(productId, { transaction });
    
    if (!product) {
      await transaction.rollback();
      throw new Error('Product not found');
    }
    
    // Check if user is admin or the seller of the product
    if (userRole !== 'admin' && product.sellerId !== userId) {
      await transaction.rollback();
      throw new Error('Not authorized to delete this product');
    }
    
    // Instead of deleting, set status to inactive
    product.status = 'inactive';
    await product.save({ transaction });
    
    await transaction.commit();
    
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}; 