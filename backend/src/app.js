const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { sequelize } = require('./config/database');
const { errorHandler } = require('./middlewares/error');

// Cấu hình Passport
require('./config/passport')();

// Import routes
const routes = require('./routes');

// Khởi tạo app
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Security Middlewares
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 100 // 100 requests mỗi 10 phút
});
app.use(limiter);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Passport middleware
app.use(passport.initialize());

// Sử dụng routes
app.use(routes);

// Handle không tìm thấy route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Không tìm thấy ${req.originalUrl}`
  });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;
