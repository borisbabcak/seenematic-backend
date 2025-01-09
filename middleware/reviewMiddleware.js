import Review from '../models/Review.js';
import jwt from 'jsonwebtoken';
import { containsProfanity, censorText } from '../utils/obscenity.js';

// Checks for existing review of user
export const checkExistingReview = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Check for existing review
            const existingReview = await Review.findOne({
                user_id: decoded.id,
                movie_id: req.params.movieId
            });

            if (existingReview) {
                return res.status(400).json({ error: 'You have already reviewed this movie' });
            }

            // Add userId to request
            req.userId = decoded.id;
            next();
        } catch (jwtError) {
            console.error('Token verification failed:', jwtError);
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error('Review middleware error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

export const validateReviewInput = (req, res, next) => {
    const { movie_name, content, rating } = req.body;
    
    if (!movie_name || !content || !rating) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: movie_name, content and rating'
        });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
        return res.status(400).json({
            success: false,
            error: 'Rating must be an integer between 1 and 10'
        });
    }

    if (content.length > 1000) {
        return res.status(400).json({
            success: false,
            error: 'Content must not exceed 1000 characters'
        });
    }

    next();
};

// Checks for profanity in text review
export const sanitizeReviewText = (req, res, next) => {
    const { content } = req.body;

    // Check for profanity words
    if (containsProfanity(content)) {
        // Censor If contain offensive word
        req.body.content = censorText(content);
    }

    next();
};