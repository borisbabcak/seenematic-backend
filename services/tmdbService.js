import axios from 'axios';

class TMDBService {
    constructor() {
        this.baseUrl = process.env.TMDB_BASE_URL;
        this.apiKey = process.env.TMDB_API_KEY;
        this.language = 'en-US';
    }

    #createRequest() {
        return axios.create({
            baseURL: this.baseUrl,
            params: {
                api_key: this.apiKey,
                language: this.language
            }
        });
    }

    async getGenres() {
        try {
            const response = await this.#createRequest().get('/genre/movie/list');
            return response.data.genres;
        } catch (error) {
            throw new Error('Failed to fetch genres');
        }
    }

    async getTrendingMovies() {
        try {
            const response = await this.#createRequest().get('/trending/movie/week');
            return response.data.results;
        } catch (error) {
            throw new Error('Failed to fetch trending movies');
        }
    }

    async getLatestMovies(page = 1) {
        try {
            const response = await this.#createRequest().get('/movie/now_playing', {
                params: { page }
            });
            return response.data.results;
        } catch (error) {
            throw new Error('Failed to fetch latest movies');
        }
    }

    async searchMovies(query, page = 1) {
        try {
            if (!query) {
                throw new Error('Search query is required');
            }

            const response = await this.#createRequest().get('/search/movie', {
                params: {
                    query,
                    page
                }
            });
            return response.data.results;
        } catch (error) {
            throw new Error(error.message || 'Failed to search movies');
        }
    }

    async discoverMovies({ genre, sortBy = 'popularity.desc', page = 1 }) {
        try {
            const response = await this.#createRequest().get('/discover/movie', {
                params: {
                    with_genres: genre,
                    sort_by: sortBy,
                    page
                }
            });
            return response.data.results;
        } catch (error) {
            throw new Error('Failed to discover movies');
        }
    }

    async getMovieTrailers(movieId) {
        try {
            if (!movieId) {
                throw new Error('Movie ID is required');
            }

            const response = await this.#createRequest().get(`/movie/${movieId}/videos`);
            return response.data.results;
        } catch (error) {
            throw new Error('Failed to fetch movie trailers');
        }
    }

    async getMovieImages(movieId) {
        try {
            if (!movieId) {
                throw new Error('Movie ID is required');
            }

            const response = await this.#createRequest().get(`/movie/${movieId}/images`, {
                params: {
                    include_image_language: 'en,null'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch movie images');
        }
    }

    async getMovieDetails(movieId) {
        try {
            if (!movieId) {
                throw new Error('Movie ID is required');
            }

            const response = await this.#createRequest().get(`/movie/${movieId}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch movie details');
        }
    }
}

export default new TMDBService();