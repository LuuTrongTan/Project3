const { Product, Category, Review, User } = require('../../../models');
const { Op } = require('sequelize');

/**
 * Lấy tất cả sản phẩm với phân trang, sắp xếp và lọc
 * @param {Object} queryParams - Các tham số query
 * @returns {Object} Các sản phẩm và thông tin phân trang
 */
const getAllProducts = async (queryParams) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const offset = (page - 1) * limit;
  const sortBy = queryParams.sortBy || 'createdAt';
  const sortOrder = queryParams.sortOrder || 'DESC';
  
  // Filtering
  const filter = {};
  
  if (queryParams.category) {
    const category = await Category.findOne({ 
      where: { id: queryParams.category }
    });
    
    if (category) {
      const productIds = await category.getProducts().map(product => product.id);
      filter.id = { [Op.in]: productIds };
    }
  }
  
  if (queryParams.search) {
    filter.name = { [Op.iLike]: `%${queryParams.search}%` };
  }
  
  if (queryParams.minPrice) {
    filter.price = { ...filter.price, [Op.gte]: queryParams.minPrice };
  }
  
  if (queryParams.maxPrice) {
    filter.price = { ...filter.price, [Op.lte]: queryParams.maxPrice };
  }
  
  // Only show active products
  filter.status = 'active';
  
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
 * Lấy sản phẩm theo ID
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
      },
      {
        model: Review,
        as: 'reviews',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'avatar']
          }
        ]
      }
    ]
  });
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  // Check if product is active
  if (product.status !== 'active') {
    throw new Error('Product not found or unavailable');
  }
  
  return product;
};

module.exports = {
  getAllProducts,
  getProductById
};