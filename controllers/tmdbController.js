import axios from 'axios';

const tmdbBaseUrl = process.env.TMDB_BASE_URL;
const apiKey = process.env.TMDB_API_KEY;

// Get genres for movies
export const getGenres = async (req, res) => {
  try {
    const response = await axios.get(`${tmdbBaseUrl}/genre/movie/list`, {
      params: { api_key: apiKey, language: 'en-US' },
    });
    res.status(200).json(response.data.genres);
  } catch (error) {
    console.error('Error fetching genres:', error.message);
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
};

// Get trending movies by last week
export const getTrendingMovies = async (req, res) => {
  try {
    const response = await axios.get(`${tmdbBaseUrl}/trending/movie/week`, {
      params: { api_key: apiKey, language: 'en-US' },
    });
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error('Error fetching trending movies:', error.message);
    res.status(500).json({ message: 'Failed to fetch trending movies' });
  }
};

// Get latest movies
export const getLatestMovies = async (req, res) => {
  try {
    const response = await axios.get(`${tmdbBaseUrl}/movie/now_playing`, {
      params: { api_key: apiKey, language: 'en-US', page: req.query.page || 1, },
    });
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error('Error fetching latest movies:', error.message);
    res.status(500).json({ message: 'Failed to fetch latest movies' });
  }
};



// Search for movies by title
export const searchMovies = async (req, res) => {
  const { query, page } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const params = {
      api_key: apiKey,
      language: 'en-US',
      query: query || '',
      page: page || 1,
    };

    const response = await axios.get(`${tmdbBaseUrl}/search/movie`, { params });
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error('Error searching movies:', error.message);
    res.status(500).json({ message: 'Failed to search movies' });
  }
};

// Discover movies with flexible filters
export const discoverMovies = async (req, res) => {
  const { genre, sortBy, page } = req.query;

  try {
    const params = {
      api_key: apiKey,
      language: 'en-US',
      with_genres: genre || '', // Filter by genre if provided
      sort_by: sortBy || 'popularity.desc', // Default sorting by popularity
      page: page || 1, // Default to page 1
    };

    const response = await axios.get(`${tmdbBaseUrl}/discover/movie`, { params });
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error('Error discovering movies:', error.message);
    res.status(500).json({ message: 'Failed to discover movies' });
  }
};

// Get trailers for a specific movie
export const getMovieTrailers = async (req, res) => {
    const { movieId } = req.params;
    if (!movieId) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }
    try {
      const response = await axios.get(`${tmdbBaseUrl}/movie/${movieId}/videos`, {
        params: { api_key: apiKey, language: 'en-US',},
      });
      res.status(200).json(response.data.results);
    } catch (error) {
      console.error('Error fetching movie trailers:', error.message);
      res.status(500).json({ message: 'Failed to fetch movie trailers' });
    }
  };

// Get images for a specific movie
export const getMovieImages = async (req, res) => {
    const { movieId } = req.params;
    try {
        const response = await axios.get(`${tmdbBaseUrl}/movie/${movieId}/images`, {
            params: { 
                api_key: apiKey,
                language: 'en-US',
                include_image_language: 'en,null'
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching movie images:', error.message);
        res.status(500).json({ message: 'Failed to fetch movie images', error: error.message });
    }
};

// Get movie details
export const getMovieDetails = async (req, res) => {
    const { movieId } = req.params;
    try {
        const response = await axios.get(`${tmdbBaseUrl}/movie/${movieId}`, {
            params: { 
                api_key: apiKey,
                language: 'en-US'
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching movie details:', error.message);
        res.status(500).json({ message: 'Failed to fetch movie details', error: error.message });
    }
};