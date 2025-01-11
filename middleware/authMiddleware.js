import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { check } from 'express-validator';

// JWT Protection
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Registration validation
export const validateRegister = [
  check('name', 'Name is required')
      .not()
      .isEmpty()
      .isLength({min: 3, max: 20}),
  check('email', 'Please provide a valid email')
      .not()
      .isEmpty()
      .isEmail(),
  check('password', 'Password must be at least 9 characters long, contain at least one uppercase letter, and one number.')
      .isLength({ min: 9 })
      .matches(/(?=.*[A-Z])(?=.*\d)/)
];

// Login validation
export const validateLogin = [
  check('email', 'Please provide a valid email')
      .not()
      .isEmpty()
      .isEmail(),
  check('password', 'Password is required')
      .not()
      .isEmpty()
];

export default protect;