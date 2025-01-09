import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getTmdbReviews,
  addReview,
  getMovieReviews,
  getMyReviews,
} from '../controllers/reviewController.js';
import { checkExistingReview, sanitizeReviewText, validateReviewInput } from '../middleware/reviewMiddleware.js';

const router = express.Router();

// Get TMDB reviews for a movie
router.get('/t-reviews/list/:movieId', getTmdbReviews);

// Add SEENEMATIC user review to a movie
router.post('/add/:movieId', checkExistingReview, sanitizeReviewText, validateReviewInput, addReview);

// Get SEENEMATIC users reviews for a movie
router.get('/list/:movieId', getMovieReviews)

// Get SEENEMATIC user all reviews
router.get('/my-reviews', protect, getMyReviews)

export default router;