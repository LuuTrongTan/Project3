const { Category } = require('../../../models');

/**
 * Lấy tất cả danh mục
 * @returns {Object} Danh sách danh mục
 */
const getAllCategories = async () => {
  // Only get active categories
  const categories = await Category.findAll({
    where: { status: true },
    include: [
      {
        model: Category,
        as: 'children',
        where: { status: true },
        required: false
      }
    ]
  });
  
  // Filter out categories that have a parent (to get only root categories)
  const rootCategories = categories.filter(category => !category.parentId);
  
  return {
    count: rootCategories.length,
    categories: rootCategories
  };
};

/**
 * Lấy danh mục theo ID
 * @param {number} categoryId - ID của danh mục
 * @returns {Object} Thông tin danh mục
 */
const getCategoryById = async (categoryId) => {
  const category = await Category.findByPk(categoryId, {
    include: [
      {
        model: Category,
        as: 'children',
        where: { status: true },
        required: false
      }
    ]
  });
  
  if (!category) {
    throw new Error('Category not found');
  }
  
  // Check if category is active
  if (!category.status) {
    throw new Error('Category not found or unavailable');
  }
  
  return category;
};

module.exports = {
  getAllCategories,
  getCategoryById
}; 