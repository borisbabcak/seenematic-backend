import axios from 'axios';
import Review from '../models/Review.js';

const tmdbBaseUrl = process.env.TMDB_BASE_URL;
const apiKey = process.env.TMDB_API_KEY;

// Add a review to a movie
export const addReview = async (req, res) => { 
  const { movieId } = req.params;
  const { movie_name, content, rating } = req.body;
  
  try {
      const review = new Review({
          user_id: req.userId,
          movie_id: parseInt(movieId),
          movie_name,
          content,
            author_details: {
                rating: parseInt(rating)
            },
            created_at: new Date()
      });

      await review.save();
      await review.populate('user_id', 'name');
      
      res.status(201).json({
          success: true,
          data: {
            id: review._id,
            author: review.user_id.name,
            authorTag: '(Seenematic User)',
            content: review.content,
            created_at: review.created_at,
            author_details: review.author_details,
            movie_name: review.movie_name,
            movie_id: review.movie_id
        }
      });
  } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ 
          success: false,
          error: 'Failed to add review' 
      });
  }
};

// Get reviews for a specific movie from our users
export const getMovieReviews = async (req, res) => {
  const { movieId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
      const reviews = await Review.find({ movie_id: movieId })
          .populate('user_id', 'name')
          .sort({ created_at: -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit));

      const total = await Review.countDocuments({ movie_id: movieId });

      const formattedReviews = reviews.map(review => ({
          id: review._id,
          author: review.user_id.name,
          authorTag: '(Seenematic User)',
          content: review.content,
          created_at: review.created_at,
          author_details: review.author_details
      }));

      res.status(200).json({
          success: true,
          data: {
              reviews: formattedReviews,
              totalPages: Math.ceil(total / limit),
              currentPage: parseInt(page)
          }
      });
  } catch (error) {
      console.error('Error fetching movie reviews:', error);
      res.status(500).json({ 
          success: false,
          error: 'Failed to fetch movie reviews' 
      });
  }
};

// Get reviews created by user
export const getMyReviews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
      const userId = req.user._id;

      const reviews = await Review.find({ user_id: userId })
          .populate('user_id', 'name')
          .sort({ created_at: -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit));

      const total = await Review.countDocuments({ user_id: userId });

      const formattedReviews = reviews.map(review => ({
          id: review._id,
          author: review.user_id.name,
          authorTag: '(Seenematic User)',
          content: review.content,
          created_at: review.created_at,
          author_details: review.author_details,
          movie_name: review.movie_name,
          movie_id: review.movie_id
      }));

      res.status(200).json({
          success: true,
          data: {
              reviews: formattedReviews,
              totalPages: Math.ceil(total / limit),
              currentPage: parseInt(page)
          }
      });
  } catch (error) {
      console.error('Error fetching user reviews:', error);
      res.status(500).json({ 
          success: false,
          error: 'Failed to fetch user reviews' 
      });
  }
};

// Get TMDB reviews
export const getTmdbReviews = async (req, res) => {
  const { movieId } = req.params;
  const { page } = req.query;

  try {
    const response = await axios.get(`${tmdbBaseUrl}/movie/${movieId}/reviews`, {
      params: { 
        api_key: apiKey, 
        language: 'en-US',
        page: page || 1,
     },
    });
    res.status(200).json({
        reviews: response.data.results,
        totalPages: response.data.total_pages,
        currentPage: response.data.page,
      });
  } catch (error) {
    console.error('Error fetching TMDB reviews:', error.message);
    res.status(500).json({ message: 'Failed to fetch TMDB reviews' });
  }
};