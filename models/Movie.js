import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const MovieSchema = new Schema({
  title: { type: String, required: true },
  genre: [{ type: String }],
  releaseDate: { type: Date, required: true },
  ratings: [{ type: Number }],
  reviews: [
    {
      userId: { type: String, required: true },
      review: { type: String, required: true },
      rating: { type: Number, required: true },
    },
  ],
});

export default model('Movie', MovieSchema);