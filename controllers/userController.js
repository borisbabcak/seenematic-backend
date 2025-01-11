import userService from '../services/userService.js';

// Update genres
export const selectGenres = async (req, res) => {
  try {
      const result = await userService.updateFavoriteGenres(req.user.id, req.body.genres);
      res.status(200).json(result);
  } catch (error) {
      console.error('Error updating genres:', error);
      res.status(400).json({ 
          success: false, 
          message: error.message 
      });
  }
};

// Add movie to a favourite list
export const addFavoriteMovie = async (req, res) => {
  try {
      const { movieId } = req.params;
      const result = await userService.addFavoriteMovie(req.user.id, movieId);
      res.status(200).json(result);
  } catch (error) {
      console.error('Error adding favorite movie:', error);
      res.status(400).json({ 
          success: false, 
          message: error.message 
      });
  }
};

// Remove movie from favourites
export const removeFavoriteMovie = async (req, res) => {
  try {
      const { movieId } = req.params;
      const result = await userService.removeFavoriteMovie(req.user.id, movieId);
      res.status(200).json(result);
  } catch (error) {
      console.error('Error removing favorite movie:', error);
      res.status(400).json({ 
          success: false, 
          message: error.message 
      });
  }
};

// Get favourite movies
export const getFavoriteMovies = async (req, res) => {
  try {
      const result = await userService.getFavoriteMovies(req.user.id);
      res.status(200).json(result);
  } catch (error) {
      console.error('Error fetching favorite movies:', error);
      res.status(400).json({ 
          success: false, 
          message: error.message 
      });
  }
};

// Checks if username is available
export const checkUsername = async (req, res) => {
  try {
      const result = await userService.isUsernameAvailable(req.query.username);
      res.status(200).json(result);
  } catch (error) {
      console.error('Error checking username:', error);
      res.status(400).json({ 
          success: false, 
          message: error.message 
      });
  }
};