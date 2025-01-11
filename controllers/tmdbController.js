import tmdbService from '../services/tmdbService.js';

// Get genres for movies
export const getGenres = async (req, res) => {
  try {
      const genres = await tmdbService.getGenres();
      res.status(200).json(genres);
  } catch (error) {
      console.error('Error fetching genres:', error);
      res.status(500).json({ message: error.message });
  }
};

// Get trending movies by last week
export const getTrendingMovies = async (req, res) => {
  try {
      const movies = await tmdbService.getTrendingMovies();
      res.status(200).json(movies);
  } catch (error) {
      console.error('Error fetching trending movies:', error);
      res.status(500).json({ message: error.message });
  }
};

// Get latest movies
export const getLatestMovies = async (req, res) => {
  try {
      const { page } = req.query;
      const movies = await tmdbService.getLatestMovies(page);
      res.status(200).json(movies);
  } catch (error) {
      console.error('Error fetching latest movies:', error);
      res.status(500).json({ message: error.message });
  }
};

// Search for movies by title
export const searchMovies = async (req, res) => {
  try {
      const { query, page } = req.query;
      const movies = await tmdbService.searchMovies(query, page);
      res.status(200).json(movies);
  } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({ message: error.message });
  }
};

// Discover movies with flexible filters
export const discoverMovies = async (req, res) => {
  try {
      const { genre, sortBy, page } = req.query;
      const movies = await tmdbService.discoverMovies({ genre, sortBy, page });
      res.status(200).json(movies);
  } catch (error) {
      console.error('Error discovering movies:', error);
      res.status(500).json({ message: error.message });
  }
};

// Get trailers for a specific movie
export const getMovieTrailers = async (req, res) => {
  try {
      const { movieId } = req.params;
      const trailers = await tmdbService.getMovieTrailers(movieId);
      res.status(200).json(trailers);
  } catch (error) {
      console.error('Error fetching movie trailers:', error);
      res.status(500).json({ message: error.message });
  }
}

// Get images for a specific movie
export const getMovieImages = async (req, res) => {
  try {
      const { movieId } = req.params;
      const images = await tmdbService.getMovieImages(movieId);
      res.status(200).json(images);
  } catch (error) {
      console.error('Error fetching movie images:', error);
      res.status(500).json({ message: error.message });
  }
};

// Get movie details
export const getMovieDetails = async (req, res) => {
  try {
      const { movieId } = req.params;
      const details = await tmdbService.getMovieDetails(movieId);
      res.status(200).json(details);
  } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ message: error.message });
  }
};