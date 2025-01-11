import reviewService from '../services/reviewService.js';

// Get TMDB reviews
export const getTmdbReviews = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { page } = req.query;
        const reviews = await reviewService.getTmdbReviews(movieId, page);
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching TMDB reviews:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add a review to a movie
export const addReview = async (req, res) => {
    try {
        const { movieId } = req.params;
        const result = await reviewService.addReview(req.userId, movieId, req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get reviews for a specific movie from our users
export const getMovieReviews = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { page, limit } = req.query;
        const result = await reviewService.getMovieReviews(movieId, page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching movie reviews:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get reviews created by user
export const getMyReviews = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await reviewService.getUserReviews(req.user._id, page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};