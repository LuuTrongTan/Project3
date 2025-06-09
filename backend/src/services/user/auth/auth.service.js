const { User } = require('../../../models');
const crypto = require('crypto');
const sendEmail = require('../../../utils/sendEmail');
const { Op } = require('sequelize');

/**
 * Đăng ký người dùng mới
 * @param {Object} userData - Thông tin người dùng
 * @returns {Object} Thông tin người dùng và token
 */
const registerUser = async (userData) => {
  const { email, password, fullName, phoneNumber } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    fullName,
    phoneNumber,
    role: 'user',
    authProvider: 'local'
  });

  // Generate JWT token
  const token = user.getSignedJwtToken();

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  };
};

/**
 * Đăng nhập người dùng
 * @param {Object} credentials - Thông tin đăng nhập
 * @returns {Object} Thông tin người dùng và token
 */
const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Validate email & password
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  // Check for user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error('Your account has been deactivated');
  }

  // Check if user uses social login
  if (user.authProvider !== 'local') {
    throw new Error(`This account uses ${user.authProvider} authentication. Please login with ${user.authProvider}.`);
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = user.getSignedJwtToken();

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  };
};

/**
 * Xử lý đăng nhập từ Google
 * @param {Object} profile - Thông tin profile từ Google
 * @returns {Object} Thông tin người dùng và token
 */
const handleGoogleLogin = async (user) => {
  // Generate JWT token
  const token = user.getSignedJwtToken();

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
      authProvider: user.authProvider
    }
  };
};

/**
 * Xử lý đăng nhập từ Facebook
 * @param {Object} profile - Thông tin profile từ Facebook
 * @returns {Object} Thông tin người dùng và token
 */
const handleFacebookLogin = async (user) => {
  // Generate JWT token
  const token = user.getSignedJwtToken();

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
      authProvider: user.authProvider
    }
  };
};

/**
 * Lấy thông tin người dùng hiện tại
 * @param {number} userId - ID của người dùng
 * @returns {Object} Thông tin người dùng
 */
const getCurrentUser = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Xử lý quên mật khẩu
 * @param {string} email - Email của người dùng
 * @param {string} clientUrl - URL client để reset password
 * @returns {boolean} Kết quả xử lý
 */
const forgotPassword = async (email, clientUrl) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  // Nếu tài khoản dùng social login, không cho phép reset password
  if (user.authProvider !== 'local') {
    throw new Error(`This account uses ${user.authProvider} authentication. Password reset is not available.`);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Update user
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpire = resetPasswordExpire;
  await user.save();

  // Create reset url
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  // Email message
  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: message
    });

    return true;
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    throw new Error('Email could not be sent');
  }
};

/**
 * Reset mật khẩu
 * @param {string} resetToken - Token reset password
 * @param {string} newPassword - Mật khẩu mới
 * @returns {boolean} Kết quả xử lý
 */
const resetPassword = async (resetToken, newPassword) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    where: {
      resetPasswordToken,
      resetPasswordExpire: { [Op.gt]: Date.now() }
    }
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  return true;
};

/**
 * Liên kết tài khoản Google với tài khoản hiện tại
 * @param {number} userId - ID của người dùng
 * @param {string} googleId - ID từ Google
 * @returns {Object} Thông tin người dùng đã cập nhật
 */
const linkGoogleAccount = async (userId, googleId) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Kiểm tra xem googleId đã được sử dụng chưa
  const existingUser = await User.findOne({ where: { googleId } });
  if (existingUser && existingUser.id !== user.id) {
    throw new Error('This Google account is already linked to another user');
  }
  
  user.googleId = googleId;
  await user.save();
  
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    googleId: user.googleId
  };
};

/**
 * Liên kết tài khoản Facebook với tài khoản hiện tại
 * @param {number} userId - ID của người dùng
 * @param {string} facebookId - ID từ Facebook
 * @returns {Object} Thông tin người dùng đã cập nhật
 */
const linkFacebookAccount = async (userId, facebookId) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Kiểm tra xem facebookId đã được sử dụng chưa
  const existingUser = await User.findOne({ where: { facebookId } });
  if (existingUser && existingUser.id !== user.id) {
    throw new Error('This Facebook account is already linked to another user');
  }
  
  user.facebookId = facebookId;
  await user.save();
  
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    facebookId: user.facebookId
  };
};

module.exports = {
  registerUser,
  loginUser,
  handleGoogleLogin,
  handleFacebookLogin,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  linkGoogleAccount,
  linkFacebookAccount
}; 