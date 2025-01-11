import User from '../models/User.js';

class UserService {
    async updateFavoriteGenres(userId, genres) {
        try {
            if (!genres || !Array.isArray(genres)) {
                throw new Error('Invalid genres format');
            }

            if (genres.length < 2 || genres.length > 3) {
                throw new Error('You must select 2 to 3 genres');
            }

            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            user.favouriteGenres = genres;
            await user.save();

            return {
                success: true,
                message: 'Genres successfully updated',
                genres: user.favouriteGenres
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to update genres');
        }
    }

    async isUsernameAvailable(username) {
        try {
            const existingUser = await User.findOne({ name: username });
            return {
                success: true,
                available: !existingUser
            };
        } catch (error) {
            throw new Error('Failed to check username availability');
        }
    }

    async getFavoriteMovies(userId) {
        try {
          const user = await User.findById(userId);
          if (!user) {
            throw new Error('User not found');
          }
      
          return {
            success: true,
            favorites: user.favoriteMovies || []
          };
        } catch (error) {
          throw new Error(error.message || 'Failed to fetch favorite movies');
        }
      }

    async addFavoriteMovie(userId, movieId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
    
            // Prevent duplicates
            if (!user.favoriteMovies.includes(movieId)) {
                user.favoriteMovies.push(movieId);
                await user.save();
            }
    
            return {
                success: true,
                message: 'Movie added to favorites',
                favoriteMovies: user.favoriteMovies
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to add favorite movie');
        }
    }

    async removeFavoriteMovie(userId, movieId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
    
            user.favoriteMovies = user.favoriteMovies.filter(id => id !== movieId);
            await user.save();
    
            return {
                success: true,
                message: 'Movie removed from favorites',
                favoriteMovies: user.favoriteMovies
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to remove favorite movie');
        }
    }
}

export default new UserService();