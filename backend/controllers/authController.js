import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // For generating reset tokens
// import { sendEmail } from '../utils/email.js'; // Uncomment when email is configured

// Utility to generate JWT
const generateToken = (id, role) => {
  if (!process.env.SECRET_KEY) {
    throw new Error('JWT Secret Key is not defined.');
  }
  return jwt.sign({ id, role }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d', // Default to 1 day
  });
};

// Check if authentication service is available
const checkStatus = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Authentication service is available',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication service error',
      error: error.message
    });
  }
};

// Handle Google Authentication
const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId, photoURL } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Email and Google ID are required',
      });
    }

    // Check if user already exists with the provided email
    let user = await User.findOne({ email });
    
    if (user) {
      // If user exists but doesn't have googleId (registered via email/password)
      if (!user.googleId) {
        // Link the Google account to existing user
        user.googleId = googleId;
        user.authProvider = 'google';
        // Only update photo if user doesn't have one or the new one is provided
        if (!user.photo && photoURL) {
          user.photo = photoURL;
        }
        await user.save();
        console.log('Linked Google account to existing email user:', email);
      } else if (user.googleId !== googleId) {
        // The user has a different Google ID stored - this could be suspicious
        console.warn('Potential account conflict - different Google ID for same email:', email);
        return res.status(409).json({
          success: false,
          message: 'Account conflict detected. Please contact support.',
        });
      }
      // If user exists and has matching googleId, continue with login
    } else {
      // Create new user with Google credentials
      // Generate a username from the email or name
      const username = name ? 
        name.replace(/\s+/g, '_').toLowerCase() + '_' + Math.floor(Math.random() * 1000) : 
        email.split('@')[0] + '_' + Math.floor(Math.random() * 1000);
      
      user = new User({
        username,
        email,
        googleId,
        photo: photoURL || '',
        role: 'user',
        authProvider: 'google'
      });
      
      await user.save();
      console.log('Created new user via Google auth:', email);
    }

    // Generate JWT token
    const accessToken = generateToken(user._id, user.role);

    // Set token in HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Don't send password back
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token: accessToken,
      data: userResponse,
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, photo, firebaseUid } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username',
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user with optional Firebase UID
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      photo,
      role: 'user', // Always set role to 'user' for public registration
      firebaseUid: firebaseUid || null, // Store Firebase UID if provided
      authProvider: 'local' // This is a password-based registration
    });

    await newUser.save();
    console.log('New user registered:', email);

    // Don't send password back
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse,
    });
  } catch (error) {
    console.error('Register User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, firebaseUid } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.',
      });
    }

    // If the user is registered via Google, don't allow password login
    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google login. Please log in with Google instead.',
      });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials - Incorrect password',
      });
    }

    // If Firebase UID is provided but user doesn't have one stored, update it
    if (firebaseUid && !user.firebaseUid) {
      user.firebaseUid = firebaseUid;
      await user.save();
      console.log('Updated user with Firebase UID:', email);
    }

    // Generate JWT token
    const accessToken = generateToken(user._id, user.role);

    // Set token in HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Adjust SameSite for cross-origin if needed
      maxAge: 24 * 60 * 60 * 1000, // 1 day (should match token expiry or be less)
    });

    // Don't send password back
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: accessToken, // Also send token in response body if needed by client
      data: userResponse,
    });
  } catch (error) {
    console.error('Login User Error:', error);
    if (error.message === 'JWT Secret Key is not defined.') {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error - JWT configuration issue.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the access token cookie
    res.cookie('accessToken', '', {
      httpOnly: true,
      expires: new Date(0), // Set expiry to a past date
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Placeholder for refreshToken - implement properly if session refresh is needed
const refreshToken = async (req, res) => {
  // This would typically involve verifying a refresh token (often longer-lived and stored securely)
  // and issuing a new accessToken.
  // For now, this is a stub.
  res.status(501).json({
    success: false,
    message: 'Refresh token functionality not implemented',
  });
};

// This is a simplified sendEmail stub. Replace with actual email sending logic.
const sendEmail = async ({ to, subject, text, html }) => {
  console.log(`Email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
  if (html) console.log(`HTML: ${html}`);
  // try {
  //   // Integrate with your email service (e.g., Nodemailer, SendGrid)
  //   // await emailService.send({ to, subject, text, html });
  //   console.log('Email sending simulated.');
  //   return { messageId: 'simulated-email-id' };
  // } catch (error) {
  //   console.error('Error sending email:', error);
  //   throw error; // Re-throw to be caught by the caller
  // }
  return Promise.resolve({ messageId: 'simulated-email-id' }); // Simulate success
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // To prevent email enumeration, you might want to send a generic success message
      // even if the user is not found, but log the attempt.
      return res.status(404).json({
        success: false,
        message: 'User with this email does not exist.',
      });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await user.save({ validateBeforeSave: false }); // Skip validation if only updating these fields

    // Construct reset URL (adjust base URL as needed)
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.
If you didn't forget your password, please ignore this email!`;

    try {
      // await sendEmail({ // Uncomment and configure when email is set up
      //   to: user.email,
      //   subject: 'Your password reset token (valid for 10 min)',
      //   text: message,
      //   // html: '<h1>Password Reset</h1><p>...</p>' // Optional HTML version
      // });

      res.status(200).json({
        success: true,
        message: 'Token sent to email (simulated). Please check your inbox.',
        // In development, you might want to send the token back for easier testing:
        // resetTokenForDev: process.env.NODE_ENV === 'development' ? resetToken : undefined,
      });
    } catch (err) {
      console.error('Error in forgetPassword while sending email:', err);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({
        success: false,
        message: 'There was an error sending the email. Try again later.',
      });
    }
  } catch (error) {
    console.error('Forget Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Add resetPassword function (controller for the link sent via email)
const resetPassword = async (req, res) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password'); // Ensure password field is selected if needed for save hooks, though we're directly setting it

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Token is invalid or has expired' });
    }

    if (!req.body.password || !req.body.passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Password and password confirmation are required.',
      });
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return res
        .status(400)
        .json({ success: false, message: 'Passwords do not match.' });
    }

    // Hash new password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(req.body.password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // user.passwordChangedAt = Date.now(); // Optional: track password change date

    await user.save(); // Save the updated user with the new password

    // 3) Log the user in, send JWT
    const accessToken = generateToken(user._id, user.role);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Don't send password back in the final response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You are now logged in.',
      token: accessToken,
      data: userResponse,
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  forgetPassword,
  refreshToken,
  resetPassword,
  googleAuth,
  checkStatus,
};
