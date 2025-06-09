const authService = require('../../../services/user/auth/auth.service');
const { logger } = require('../../../utils/logger');
const passport = require('passport');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (error) {
    logger.error('Registration error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (error) {
    logger.error('Login error:', error.message);
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    logger.error('Get current user error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const clientUrl = process.env.CLIENT_URL;

    await authService.forgotPassword(email, clientUrl);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    logger.error('Forgot password error:', error.message);
    
    // Specific error handling
    if (error.message.includes('authentication') || error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Email could not be sent'
    });
  }
};

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.params.resetToken, req.body.password);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    logger.error('Reset password error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * @desc    Google OAuth login - callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
const googleCallback = (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`);
    }

    // Handle the user authentication and generate token
    const result = authService.handleGoogleLogin(user);

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/social-login-success?token=${result.token}`);
  } catch (error) {
    logger.error('Google callback error:', error.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=${error.message}`);
  }
};

/**
 * @desc    Facebook OAuth login - callback
 * @route   GET /api/auth/facebook/callback
 * @access  Public
 */
const facebookCallback = (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`);
    }

    // Handle the user authentication and generate token
    const result = authService.handleFacebookLogin(user);

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/social-login-success?token=${result.token}`);
  } catch (error) {
    logger.error('Facebook callback error:', error.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=${error.message}`);
  }
};

/**
 * @desc    Link Google account to current user
 * @route   GET /api/auth/link/google/callback
 * @access  Private
 */
const linkGoogleCallback = async (req, res) => {
  try {
    const { user } = req;
    const googleId = req.account.id;

    await authService.linkGoogleAccount(user.id, googleId);

    res.redirect(`${process.env.CLIENT_URL}/profile?message=Google account linked successfully`);
  } catch (error) {
    logger.error('Link Google account error:', error.message);
    res.redirect(`${process.env.CLIENT_URL}/profile?error=${error.message}`);
  }
};

/**
 * @desc    Link Facebook account to current user
 * @route   GET /api/auth/link/facebook/callback
 * @access  Private
 */
const linkFacebookCallback = async (req, res) => {
  try {
    const { user } = req;
    const facebookId = req.account.id;

    await authService.linkFacebookAccount(user.id, facebookId);

    res.redirect(`${process.env.CLIENT_URL}/profile?message=Facebook account linked successfully`);
  } catch (error) {
    logger.error('Link Facebook account error:', error.message);
    res.redirect(`${process.env.CLIENT_URL}/profile?error=${error.message}`);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  googleCallback,
  facebookCallback,
  linkGoogleCallback,
  linkFacebookCallback
}; 