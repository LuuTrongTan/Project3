// Guest services
const productService = require('./user/guest/product.service');
const categoryService = require('./user/guest/category.service');
const reviewService = require('./user/guest/review.service');

// Auth services
const authService = require('./user/auth/auth.service');
const profileService = require('./user/auth/profile.service');
const orderService = require('./user/auth/order.service');

// Admin services
const adminUserService = require('./admin/user.service');
const adminProductService = require('./admin/product.service');
const adminOrderService = require('./admin/order.service');

module.exports = {
  // Guest services
  productService,
  categoryService,
  reviewService,
  
  // Auth services
  authService,
  profileService,
  orderService,
  
  // Admin services
  adminUserService,
  adminProductService,
  adminOrderService
}; 