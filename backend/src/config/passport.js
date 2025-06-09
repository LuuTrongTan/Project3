const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models');
const { logger } = require('../utils/logger');

// Cấu hình Passport.js
module.exports = function() {
  // Serialize và deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Kiểm tra xem user đã tồn tại trong database chưa
      let user = await User.findOne({ where: { googleId: profile.id } });

      // Nếu user chưa tồn tại, tạo mới
      if (!user) {
        // Kiểm tra xem email đã được đăng ký chưa
        const existingUser = await User.findOne({ 
          where: { email: profile.emails[0].value } 
        });

        if (existingUser) {
          // Nếu email đã tồn tại nhưng chưa liên kết với Google
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
            existingUser.authProvider = 'google';
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        // Tạo user mới
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          fullName: profile.displayName,
          avatar: profile.photos[0]?.value,
          authProvider: 'google',
          isActive: true,
          lastLogin: new Date()
        });
      } else {
        // Cập nhật thông tin nếu user đã tồn tại
        user.lastLogin = new Date();
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      logger.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));

  // Facebook OAuth Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.API_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
    scope: ['email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Kiểm tra xem user đã tồn tại trong database chưa
      let user = await User.findOne({ where: { facebookId: profile.id } });

      // Nếu user chưa tồn tại, tạo mới
      if (!user) {
        // Facebook không luôn luôn trả về email, nên cần kiểm tra
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@facebook.com`;

        // Kiểm tra xem email đã được đăng ký chưa
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
          // Nếu email đã tồn tại nhưng chưa liên kết với Facebook
          if (!existingUser.facebookId) {
            existingUser.facebookId = profile.id;
            existingUser.authProvider = 'facebook';
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        // Tạo user mới
        const fullName = profile.name 
          ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim()
          : profile.displayName || 'Facebook User';

        user = await User.create({
          facebookId: profile.id,
          email,
          fullName,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          authProvider: 'facebook',
          isActive: true,
          lastLogin: new Date()
        });
      } else {
        // Cập nhật thông tin nếu user đã tồn tại
        user.lastLogin = new Date();
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      logger.error('Facebook OAuth error:', error);
      return done(error, null);
    }
  }));
}; 