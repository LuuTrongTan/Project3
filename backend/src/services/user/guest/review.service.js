const { Review, User, Product } = require('../../../models');

/**
 * Lấy đánh giá cho sản phẩm
 * @param {number} productId - ID của sản phẩm
 * @returns {Object} Danh sách đánh giá
 */
const getReviewsByProductId = async (productId) => {
  // Check if product exists and is active
  const product = await Product.findByPk(productId);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  if (product.status !== 'active') {
    throw new Error('Product not found or unavailable');
  }
  
  // Get reviews for the product
  const reviews = await Review.findAll({
    where: { productId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'avatar']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  
  return {
    count: reviews.length,
    reviews
  };
};

module.exports = {
  getReviewsByProductId
}; 