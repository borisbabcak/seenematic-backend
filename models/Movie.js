const mongoose = require('mongoose');

const MovieSchema = new Schema({
  title: String,
  genre: [String],
  releaseDate: Date,
  ratings: [Number],
  reviews: [
    {
      userId: String,
      review: String,
      rating: Number,
    },
  ],
});

export default model('Movie', MovieSchema);