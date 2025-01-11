import axios from 'axios';
import Review from '../models/Review.js';

class ReviewService {
    constructor() {
        this.tmdbBaseUrl = process.env.TMDB_BASE_URL;
        this.apiKey = process.env.TMDB_API_KEY;
    }

    async getTmdbReviews(movieId, page = 1) {
        try {
            const response = await axios.get(`${this.tmdbBaseUrl}/movie/${movieId}/reviews`, {
                params: { 
                    api_key: this.apiKey, 
                    language: 'en-US',
                    page
                },
            });
            
            return {
                reviews: response.data.results,
                totalPages: response.data.total_pages,
                currentPage: response.data.page,
            };
        } catch (error) {
            throw new Error('Failed to fetch TMDB reviews');
        }
    }

    async addReview(userId, movieId, reviewData) {
        try {
            const review = new Review({
                user_id: userId,
                movie_id: parseInt(movieId),
                movie_name: reviewData.movie_name,
                content: reviewData.content,
                author_details: {
                    rating: parseInt(reviewData.rating)
                },
                created_at: new Date()
            });

            await review.save();
            await review.populate('user_id', 'name');

            return {
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
            };
        } catch (error) {
            throw new Error('Failed to add review');
        }
    }

    async getMovieReviews(movieId, page = 1, limit = 10) {
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

            return {
                success: true,
                data: {
                    reviews: formattedReviews,
                    totalPages: Math.ceil(total / limit),
                    currentPage: parseInt(page)
                }
            };
        } catch (error) {
            throw new Error('Failed to fetch movie reviews');
        }
    }

    async getUserReviews(userId, page = 1, limit = 10) {
        try {
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

            return {
                success: true,
                data: {
                    reviews: formattedReviews,
                    totalPages: Math.ceil(total / limit),
                    currentPage: parseInt(page)
                }
            };
        } catch (error) {
            throw new Error('Failed to fetch user reviews');
        }
    }
}

export default new ReviewService();