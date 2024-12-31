import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

router.post('/api/movies', async (req, res) => {
  const { title, genre, releaseDate, ratings } = req.body;

  try {
    const newMovie = new Movie({
      title,
      genre,
      releaseDate,
      ratings,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Error creating movie', error });
  }
});

export default router;