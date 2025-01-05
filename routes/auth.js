import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import protect from '../middleware/authMiddleware.js';

const router = Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registration route
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty().isLength({min: 3, max: 20}),
    check('email', 'Please provide a valid email').not().isEmpty().isEmail(),
    check('password', 'Password must be at least 9 characters long, contain at least one uppercase letter, and one number.')
  .isLength({ min: 9 })
  .matches(/(?=.*[A-Z])(?=.*\d)/)
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const { name, email, password } = req.body;

    const bannedWords = ['dumbass', 'idiot', 'moron', 'scumbag', 'jackass', 'loser', 'twat', 'wanker',
      'bollocks', 'tosser','twat', 'arsehole', 'maggot', 'queer', 'dyke', 'sucker',
      'bollock', 'crapper', 'rapist', 'chink', 'gypsy', 'nazi', 'fatass','f4ck'];
    if (bannedWords.some((word) => name.toLowerCase().includes(word))) {
      return res.status(400).json({ message: 'Name contains inappropriate content.' });
    }

    try {
      const existingName = await User.findOne({ name });
      if (existingName) {
        return res.status(400).json({ message: 'Name already in use' });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// Login route
router.post(
  '/login',
  [
    check('email', 'Please provide a valid email').not().isEmpty().isEmail(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Email not found' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      const token = generateToken(user._id);

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

router.get('/my-profile', protect, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;