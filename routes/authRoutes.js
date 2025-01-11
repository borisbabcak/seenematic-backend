import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect, validateRegister, validateLogin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/my-profile', protect, getProfile);

export default router;