import mongoose from 'mongoose';

// Mongodb schema of a Review
const reviewSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        movie_id: {
            type: Number,
            required: true,
        },
        movie_name: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            maxlength: 1000,
        },
        author_details: {
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 10,
            }
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        
    },
    {
        timestamps:true,
        toJSON: { 
            transform: function(doc, ret) {
                ret.author = doc.user_id.name;
                ret.authorTag = '(Seenematic User)';
                return ret;
            }
        }
    },
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;