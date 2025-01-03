import { Router } from 'express';
import { selectGenres } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/select-genres', authMiddleware, selectGenres);

export default router;