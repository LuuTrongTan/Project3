const { Order, OrderItem, Product, User } = require('../../models');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');

/**
 * Lấy danh sách đơn hàng với phân trang và lọc
 * @param {Object} queryParams - Tham số truy vấn
 * @returns {Object} Danh sách đơn hàng
 */
const getAllOrders = async (queryParams) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const offset = (page - 1) * limit;
  
  // Filtering
  const filter = {};
  
  if (queryParams.orderStatus) {
    filter.orderStatus = queryParams.orderStatus;
  }
  
  if (queryParams.paymentStatus) {
    filter.paymentStatus = queryParams.paymentStatus;
  }
  
  if (queryParams.userId) {
    filter.userId = queryParams.userId;
  }
  
  if (queryParams.minAmount) {
    filter.totalAmount = { ...filter.totalAmount, [Op.gte]: queryParams.minAmount };
  }
  
  if (queryParams.maxAmount) {
    filter.totalAmount = { ...filter.totalAmount, [Op.lte]: queryParams.maxAmount };
  }
  
  if (queryParams.startDate) {
    filter.createdAt = { ...filter.createdAt, [Op.gte]: new Date(queryParams.startDate) };
  }
  
  if (queryParams.endDate) {
    filter.createdAt = { ...filter.createdAt, [Op.lte]: new Date(queryParams.endDate) };
  }
  
  const { count, rows: orders } = await Order.findAndCountAll({
    where: filter,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'phoneNumber']
      }
    ]
  });
  
  return {
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    orders
  };
};

/**
 * Lấy thông tin đơn hàng theo ID
 * @param {number} orderId - ID của đơn hàng
 * @returns {Object} Thông tin đơn hàng
 */
const getOrderById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'description', 'images', 'price']
          }
        ]
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'phoneNumber']
      }
    ]
  });
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  return order;
};

/**
 * Cập nhật trạng thái đơn hàng
 * @param {number} orderId - ID của đơn hàng
 * @param {Object} statusData - Dữ liệu trạng thái
 * @returns {Object} Thông tin đơn hàng đã cập nhật
 */
const updateOrderStatus = async (orderId, statusData) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { orderStatus, paymentStatus } = statusData;
    
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: 'items'
        }
      ],
      transaction
    });
    
    if (!order) {
      await transaction.rollback();
      throw new Error('Order not found');
    }
    
    // Update order status if provided
    if (orderStatus) {
      // Handle special case when cancelling an order
      if (orderStatus === 'cancelled' && !['cancelled', 'delivered'].includes(order.orderStatus)) {
        // Restore product quantities
        for (const item of order.items) {
          const product = await Product.findByPk(item.productId, { transaction });
          if (product) {
            product.quantity += item.quantity;
            await product.save({ transaction });
          }
        }
      }
      
      order.orderStatus = orderStatus;
    }
    
    // Update payment status if provided
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    
    await order.save({ transaction });
    
    await transaction.commit();
    
    return {
      id: order.id,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Xóa đơn hàng
 * @param {number} orderId - ID của đơn hàng
 * @returns {boolean} Kết quả xóa
 */
const deleteOrder = async (orderId) => {
  const transaction = await sequelize.transaction();
  
  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: 'items'
        }
      ],
      transaction
    });
    
    if (!order) {
      await transaction.rollback();
      throw new Error('Order not found');
    }
    
    // If order is not cancelled or delivered, restore product quantities
    if (!['cancelled', 'delivered'].includes(order.orderStatus)) {
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId, { transaction });
        if (product) {
          product.quantity += item.quantity;
          await product.save({ transaction });
        }
      }
    }
    
    // Delete order items
    await OrderItem.destroy({
      where: { orderId },
      transaction
    });
    
    // Delete order
    await order.destroy({ transaction });
    
    await transaction.commit();
    
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Lấy thống kê đơn hàng
 * @returns {Object} Thông tin thống kê
 */
const getOrderStatistics = async () => {
  // Total orders
  const totalOrders = await Order.count();
  
  // Total revenue (from paid orders)
  const totalRevenue = await Order.sum('totalAmount', {
    where: { paymentStatus: 'paid' }
  });
  
  // Orders by status
  const ordersByStatus = await Order.count({
    group: ['orderStatus']
  });
  
  // Orders by payment status
  const ordersByPaymentStatus = await Order.count({
    group: ['paymentStatus']
  });
  
  // Recent orders
  const recentOrders = await Order.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email']
      }
    ]
  });
  
  return {
    totalOrders,
    totalRevenue: totalRevenue || 0,
    ordersByStatus: ordersByStatus.reduce((acc, curr) => {
      acc[curr.orderStatus] = curr.count;
      return acc;
    }, {}),
    ordersByPaymentStatus: ordersByPaymentStatus.reduce((acc, curr) => {
      acc[curr.paymentStatus] = curr.count;
      return acc;
    }, {}),
    recentOrders
  };
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStatistics
}; 