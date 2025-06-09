const express = require('express');
const router = express.Router();
const passport = require('passport');
const { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword,
  googleCallback,
  facebookCallback,
  linkGoogleCallback,
  linkFacebookCallback
} = require('../../../controllers/user/auth/auth.controller');
const { protect } = require('../../../middlewares/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Forgot password
 * @access  Public
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route   PUT /api/auth/reset-password/:resetToken
 * @desc    Reset password
 * @access  Public
 */
router.put('/reset-password/:resetToken', resetPassword);

/**
 * @route   GET /api/auth/google
 * @desc    Auth with Google
 * @access  Public
 */
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google auth callback
 * @access  Public
 */
router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login'
  }),
  googleCallback
);

/**
 * @route   GET /api/auth/facebook
 * @desc    Auth with Facebook
 * @access  Public
 */
router.get('/facebook', passport.authenticate('facebook', { 
  scope: ['email'] 
}));

/**
 * @route   GET /api/auth/facebook/callback
 * @desc    Facebook auth callback
 * @access  Public
 */
router.get('/facebook/callback', 
  passport.authenticate('facebook', { 
    session: false,
    failureRedirect: '/login'
  }),
  facebookCallback
);

/**
 * @route   GET /api/auth/link/google
 * @desc    Link Google account to existing user
 * @access  Private
 */
router.get('/link/google', protect, passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

/**
 * @route   GET /api/auth/link/google/callback
 * @desc    Google auth callback for account linking
 * @access  Private
 */
router.get('/link/google/callback', 
  protect,
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/profile'
  }),
  linkGoogleCallback
);

/**
 * @route   GET /api/auth/link/facebook
 * @desc    Link Facebook account to existing user
 * @access  Private
 */
router.get('/link/facebook', protect, passport.authenticate('facebook', { 
  scope: ['email'] 
}));

/**
 * @route   GET /api/auth/link/facebook/callback
 * @desc    Facebook auth callback for account linking
 * @access  Private
 */
router.get('/link/facebook/callback', 
  protect,
  passport.authenticate('facebook', { 
    session: false,
    failureRedirect: '/profile'
  }),
  linkFacebookCallback
);

module.exports = router; 