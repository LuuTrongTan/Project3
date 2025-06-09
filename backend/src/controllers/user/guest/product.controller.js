const productService = require('../../../services/user/guest/product.service');

/**
 * @desc    Get all products with pagination, sorting and filtering
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    // Handle specific errors with appropriate status codes
    if (error.message === 'Product not found' || error.message === 'Product not found or unavailable') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById
}; 