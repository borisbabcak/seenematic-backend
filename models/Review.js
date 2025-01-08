import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        review_id: {
            type: String,
            required: true,
            trim: true,
        },
        movie_id: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            length: 500,
        },
        rating: {
            type: Number,
            required: true
        },
    },
    {
        timestamps:true,
    },
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;