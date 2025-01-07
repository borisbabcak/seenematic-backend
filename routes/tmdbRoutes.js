import express from 'express';
import {
  getGenres,
  getTrendingMovies,
  getLatestMovies,
  searchMovies,
  discoverMovies,
  getMovieTrailers,
  getMovieImages,
  getMovieDetails
} from '../controllers/tmdbController.js';

const router = express.Router();

router.get('/genres', getGenres);
router.get('/trending', getTrendingMovies);
router.get('/latest', getLatestMovies);
router.get('/search', searchMovies); //by movie name/title
router.get('/discover', discoverMovies); //flexible filtering
router.get('/movie/:movieId/trailers', getMovieTrailers);
router.get('/movie/:movieId/images', getMovieImages);
router.get('/movie/:movieId', getMovieDetails);

export default router;