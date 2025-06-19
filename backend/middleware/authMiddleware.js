import jwt from 'jsonwebtoken';
import User from '../models/User.js'

const verifyToken = (req, res, next) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized - No token provided' });
  }

  if (!process.env.SECRET_KEY) {
    console.error('JWT Secret Key is not defined in environment variables.');
    return res
      .status(500)
      .json({
        success: false,
        message: 'Internal Server Error - JWT secret missing',
      });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { id: decoded.id, role: decoded.role }; // Attach user info to request
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized - Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .json({ success: false, message: 'Unauthorized - Invalid token' });
    }
    return res
      .status(403)
      .json({
        success: false,
        message: 'Forbidden - Token verification failed',
      });
  }
};

const verifyUser = (req, res, next) => {
  // verifyToken should have already run and populated req.user
  if (!req.user) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'Unauthorized - Authentication required',
      });
  }
  const userIdFromToken = req.user.id;
  const paramsId = req.params.id; // ID from route parameters (e.g., /users/:id)
  const userRole = req.user.role;

  if (userIdFromToken === paramsId || userRole === 'admin') {
    next();
  } else {
    return res
      .status(403)
      .json({
        success: false,
        message: 'Forbidden - You are not authorized to perform this action',
      });
  }
};

const verifyAdmin = (req, res, next) => {
  // verifyToken should have already run and populated req.user
  if (!req.user) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'Unauthorized - Authentication required',
      });
  }
  const userRole = req.user.role;

  if (userRole === 'admin') {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: 'Forbidden - Admin access required' });
  }
};

export { verifyToken, verifyAdmin, verifyUser };
