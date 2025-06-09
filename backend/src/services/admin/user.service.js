const { User } = require('../../models');
const { Op } = require('sequelize');

/**
 * Lấy danh sách người dùng với phân trang và lọc
 * @param {Object} queryParams - Tham số truy vấn
 * @returns {Object} Danh sách người dùng
 */
const getAllUsers = async (queryParams) => {
  const page = parseInt(queryParams.page, 10) || 1;
  const limit = parseInt(queryParams.limit, 10) || 10;
  const offset = (page - 1) * limit;
  
  // Filtering
  const filter = {};
  
  if (queryParams.search) {
    filter[Op.or] = [
      { fullName: { [Op.iLike]: `%${queryParams.search}%` } },
      { email: { [Op.iLike]: `%${queryParams.search}%` } }
    ];
  }
  
  if (queryParams.role) {
    filter.role = queryParams.role;
  }
  
  if (queryParams.active) {
    filter.isActive = queryParams.active === 'true';
  }
  
  const { count, rows: users } = await User.findAndCountAll({
    where: filter,
    attributes: { exclude: ['password'] },
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
  
  return {
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    users
  };
};

/**
 * Lấy thông tin người dùng theo ID
 * @param {number} userId - ID của người dùng
 * @returns {Object} Thông tin người dùng
 */
const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

/**
 * Tạo người dùng mới
 * @param {Object} userData - Dữ liệu người dùng
 * @returns {Object} Thông tin người dùng đã tạo
 */
const createUser = async (userData) => {
  const { email, password, fullName, phoneNumber, role, isActive } = userData;
  
  // Check if user with the same email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  // Create user
  const user = await User.create({
    email,
    password,
    fullName,
    phoneNumber,
    role: role || 'user',
    isActive: isActive === undefined ? true : isActive
  });
  
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isActive: user.isActive
  };
};

/**
 * Cập nhật thông tin người dùng
 * @param {number} userId - ID của người dùng
 * @param {Object} userData - Dữ liệu cập nhật
 * @returns {Object} Thông tin người dùng đã cập nhật
 */
const updateUser = async (userId, userData) => {
  const { fullName, phoneNumber, role, isActive } = userData;
  
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update fields
  if (fullName !== undefined) user.fullName = fullName;
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  
  await user.save();
  
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isActive: user.isActive
  };
};

/**
 * Vô hiệu hóa tài khoản người dùng
 * @param {number} userId - ID của người dùng
 * @returns {boolean} Kết quả vô hiệu hóa
 */
const deactivateUser = async (userId) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check if user is admin
  if (user.role === 'admin') {
    throw new Error('Cannot delete admin user');
  }
  
  // Instead of deleting, deactivate the account
  user.isActive = false;
  await user.save();
  
  return true;
};

/**
 * Thay đổi trạng thái hoạt động của người dùng
 * @param {number} userId - ID của người dùng
 * @param {boolean} isActive - Trạng thái hoạt động
 * @returns {Object} Thông tin trạng thái đã cập nhật
 */
const changeUserStatus = async (userId, isActive) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  user.isActive = isActive;
  await user.save();
  
  return {
    id: user.id,
    isActive: user.isActive
  };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
  changeUserStatus
}; 