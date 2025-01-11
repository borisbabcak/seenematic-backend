import { Router } from 'express';
import { 
    selectGenres,
    addFavoriteMovie,
    removeFavoriteMovie,
    getFavoriteMovies 
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Save selected genres by user to database
router.post('/select-genres', authMiddleware, selectGenres);

// Favorite movie routes
router.post('/favorites/:movieId', authMiddleware, addFavoriteMovie);
router.delete('/favorites/:movieId', authMiddleware, removeFavoriteMovie);
router.get('/favorites', authMiddleware, getFavoriteMovies);

export default router;