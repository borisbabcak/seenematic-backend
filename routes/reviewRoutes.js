import express from 'express';
import {
  getTmdbReviews,
  getTmdbReviewDetails,
} from '../controllers/reviewController.js';

const router = express.Router();

// Get TMDB reviews for a movie
router.get('/t-reviews/list/:movieId', getTmdbReviews);  

// Get TMDB review details by ID
router.get('/t-reviews/detail/:reviewId', getTmdbReviewDetails);

// Get SEENEMATIC users reviews for a movie

// Get SEENEMATIC users review details

export default router;