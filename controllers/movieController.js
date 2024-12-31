import Movie from '../models/movieModel.js';

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addMovie = async (req, res) => {
  const newMovie = new Movie(req.body);
  try {
    const movie = await newMovie.save();
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: 'Invalid movie data' });
  }
};