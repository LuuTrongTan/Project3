const { Order, OrderItem, Product, User } = require('../../../models');
const { sequelize } = require('../../../config/database');

/**
 * Tạo đơn hàng mới
 * @param {number} userId - ID của người dùng
 * @param {Object} orderData - Dữ liệu đơn hàng
 * @returns {Object} Thông tin đơn hàng đã tạo
 */
const createNewOrder = async (userId, orderData) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      shippingFee, 
      note 
    } = orderData;
    
    if (!items || items.length === 0) {
      await transaction.rollback();
      throw new Error('No order items');
    }
    
    // Verify products and calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      
      if (!product) {
        await transaction.rollback();
        throw new Error(`Product not found with ID: ${item.productId}`);
      }
      
      if (product.status !== 'active') {
        await transaction.rollback();
        throw new Error(`Product is not available: ${product.name}`);
      }
      
      if (product.quantity < item.quantity) {
        await transaction.rollback();
        throw new Error(`Not enough stock for product: ${product.name}`);
      }
      
      // Calculate price (use salePrice if available, otherwise use regular price)
      const price = product.salePrice || product.price;
      const subtotal = price * item.quantity;
      
      totalAmount += subtotal;
      
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: price,
        subtotal: subtotal
      });
      
      // Update product quantity
      product.quantity -= item.quantity;
      await product.save({ transaction });
    }
    
    // Add shipping fee
    if (shippingFee) {
      totalAmount += parseFloat(shippingFee);
    }
    
    // Create order
    const order = await Order.create({
      userId,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingFee: shippingFee || 0,
      note
    }, { transaction });
    
    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        ...item,
        orderId: order.id
      }, { transaction });
    }
    
    // If all is successful, commit the transaction
    await transaction.commit();
    
    return {
      id: order.id,
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt
    };
  } catch (error) {
    // If there's an error, rollback the transaction
    await transaction.rollback();
    throw error;
  }
};

/**
 * Lấy danh sách đơn hàng của người dùng
 * @param {number} userId - ID của người dùng
 * @param {Object} queryParams - Tham số truy vấn
 * @returns {Object} Danh sách đơn hàng
 */
const getUserOrderList = async (userId, queryParams) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const offset = (page - 1) * limit;
  
  const { count, rows: orders } = await Order.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'images']
          }
        ]
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
 * @param {number} userId - ID của người dùng
 * @returns {Object} Thông tin đơn hàng
 */
const getOrderDetails = async (orderId, userId) => {
  const order = await Order.findOne({
    where: { 
      id: orderId,
      userId
    },
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
 * Hủy đơn hàng
 * @param {number} orderId - ID của đơn hàng
 * @param {number} userId - ID của người dùng
 * @returns {Object} Kết quả hủy đơn hàng
 */
const cancelUserOrder = async (orderId, userId) => {
  // Start a transaction
  const transaction = await sequelize.transaction();
  
  try {
    const order = await Order.findOne({
      where: { 
        id: orderId,
        userId
      },
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
    
    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      await transaction.rollback();
      throw new Error('Order cannot be cancelled');
    }
    
    // Restore product quantities
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (product) {
        product.quantity += item.quantity;
        await product.save({ transaction });
      }
    }
    
    // Update order status
    order.orderStatus = 'cancelled';
    await order.save({ transaction });
    
    // Commit transaction
    await transaction.commit();
    
    return {
      id: order.id,
      orderStatus: order.orderStatus
    };
  } catch (error) {
    // Rollback transaction
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  createNewOrder,
  getUserOrderList,
  getOrderDetails,
  cancelUserOrder
}; 