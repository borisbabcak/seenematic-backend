import axios from 'axios';

const tmdbBaseUrl = process.env.TMDB_BASE_URL;
const apiKey = process.env.TMDB_API_KEY;

export const getTmdbReviews = async (req, res) => {
  const { movieId } = req.params;
  const { page } = req.query;

  try {
    const response = await axios.get(`${tmdbBaseUrl}/movie/${movieId}/reviews`, {
      params: { 
        api_key: apiKey, 
        language: 'en-US',
        page: page || 1,
     },
    });
    res.status(200).json({
        reviews: response.data.results,
        totalPages: response.data.total_pages,
        currentPage: response.data.page,
      });
  } catch (error) {
    console.error('Error fetching TMDB reviews:', error.message);
    res.status(500).json({ message: 'Failed to fetch TMDB reviews' });
  }
};

export const getTmdbReviewDetails = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const response = await axios.get(`${tmdbBaseUrl}/review/${reviewId}`, {
      params: { api_key: apiKey },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching TMDB review details:', error.message);
    res.status(500).json({ message: 'Failed to fetch TMDB review details' });
  }
};