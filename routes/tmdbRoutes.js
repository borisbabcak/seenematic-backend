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

router.get('/genres', getGenres); //Get list of genres with their ID
router.get('/trending', getTrendingMovies); //Get trending movies
router.get('/latest', getLatestMovies); //Get latest movies
router.get('/search', searchMovies); //Search movie by name/title
router.get('/discover', discoverMovies); //Flexible filtering
router.get('/movie/:movieId/trailers', getMovieTrailers); //Get trailers of a movie
router.get('/movie/:movieId/images', getMovieImages); //Get images of a movie
router.get('/movie/:movieId', getMovieDetails); //Get details of a movie

export default router;