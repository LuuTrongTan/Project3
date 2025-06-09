const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Cho phép null nếu đăng nhập qua mạng xã hội
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Thêm các trường cho social login
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  facebookId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  authProvider: {
    type: DataTypes.ENUM('local', 'google', 'facebook'),
    defaultValue: 'local'
  }
}, {
  hooks: {
    beforeSave: async (user) => {
      // Chỉ hash password khi password được thay đổi và không phải từ social login
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Phương thức kiểm tra mật khẩu
User.prototype.matchPassword = async function (enteredPassword) {
  // Chỉ kiểm tra nếu có password (không phải social login)
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Phương thức tạo JWT token
User.prototype.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this.id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = User; 