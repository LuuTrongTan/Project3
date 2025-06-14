require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./config/database');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Kết nối database và khởi động server
const startServer = async () => {
  try {
    // Kiểm tra kết nối database
    await sequelize.authenticate();
    logger.info('Kết nối database thành công');
    
    // Đồng bộ models với database (chỉ trong môi trường dev)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Đồng bộ database thành công');
    }
    
    // Khởi động server
    app.listen(PORT, () => {
      logger.info(`Server đang chạy trên cổng ${PORT}`);
    });
  } catch (error) {
    logger.error(`Không thể kết nối đến database: ${error.message}`);
    process.exit(1);
  }
};

// Xử lý lỗi không bắt được
process.on('unhandledRejection', (err) => {
  logger.error(`Lỗi: ${err.message}`);
  // Tắt server và thoát
  process.exit(1);
});

startServer();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  // Close server & exit process
  process.exit(1);
});
