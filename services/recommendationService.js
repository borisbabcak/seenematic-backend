import axios from 'axios';
import User from '../models/User.js';

class RecommendationService{
    constructor() {
        this.tmdbBaseUrl = process.env.TMDB_BASE_URL;
        this.apiKey = process.env.TMDB_API_KEY;
        this.genreMap = {
            'Action': 28,
            'Adventure': 12,
            'Animation': 16,
            'Comedy': 35,
            'Crime': 80,
            'Documentary': 99,
            'Drama': 18,
            'Family': 10751,
            'Fantasy': 14,
            'History': 36,
            'Horror': 27,
            'Music': 10402,
            'Mystery': 9648,
            'Romance': 10749,
            'Science Fiction': 878,
            'TV Movie': 10770,
            'Thriller': 53,
            'War': 10752,
            'Western': 37,
        };
    }

    async getRecommendedMovies(userId) {
        try {
            const user = await User.findById(userId);
            console.log('1. Found user:', user);
            if (!user) {
                throw new Error('User not found');
            }
    
            const genreIds = user.favouriteGenres.map(genre => this.genreMap[genre]).filter(id => id);
            console.log('2. Converted genre IDs:', genreIds);
    
            const favoriteMovieGenres = await this.getGenresFromFavoriteMovies(user.favoriteMovies.slice(0, 3));
            console.log('3. Genres from favorite movies:', favoriteMovieGenres);
    
            const combinedGenres = [...new Set([...genreIds, ...favoriteMovieGenres])];
            console.log('4. Combined unique genres:', combinedGenres);
    
            let limitedGenres = combinedGenres.slice(0, 3);
            console.log('5. Limited genres for fetching:', limitedGenres);
    
            if (limitedGenres.length === 0) {
                return {
                    success: true,
                    recommendations: [],
                    message: 'No recommendations available. Add favorite movies or genres.',
                };
            }
    
            const filters = {
                minRating: 3,
                minReleaseDate: '2000-01-01',
            };
    
            let recommendations = await this.fetchMoviesByGenresAndFilters(limitedGenres, filters);

            if (recommendations.length === 0 && limitedGenres.length > 1) {
                limitedGenres = limitedGenres.slice(0, limitedGenres.length - 1);
                console.log('6. Trying with reduced genres:', limitedGenres);
                recommendations = await this.fetchMoviesByGenresAndFilters(limitedGenres, filters);
            }
    
            return {
                success: true,
                recommendations,
            };
        } catch (error) {
            console.error('Error in getRecommendedMovies:', error);
            throw new Error(error.message || 'Failed to fetch recommended movies');
        }
    }

    async getGenresFromFavoriteMovies(favoriteMovies) {
        console.log('Starting getGenresFromFavoriteMovies with:', favoriteMovies);
        const favoriteMovieGenres = new Set();
        for (const movieId of favoriteMovies) {
            try {
                const response = await axios.get(
                    `${this.tmdbBaseUrl}/movie/${movieId}?api_key=${this.apiKey}`
                );
                console.log(`Got genres for movie ${movieId}:`, response.data.genres);
                response.data.genres.forEach((genre) => favoriteMovieGenres.add(genre.id));
            } catch (error) {
                console.error(`Failed to fetch details for movie ID ${movieId}: ${error.message}`);
            }
        }
        const result = [...favoriteMovieGenres];
        console.log('Final genres from movies:', result);
        return result;
    }

    async fetchMoviesByGenresAndFilters(genres, filters) {
        const uniqueGenres = [...new Set(genres)];
        
        console.log('Fetching movies with unique genres:', uniqueGenres);
        
        const queryParams = new URLSearchParams({
            api_key: this.apiKey,
            with_genres: uniqueGenres.join(','),
            sort_by: 'popularity.desc',
            'vote_average.gte': filters.minRating.toString(),
            'primary_release_date.gte': filters.minReleaseDate,
            'include_adult': 'false',
            'language': 'en-US',
            'page': '1'
        });
    
        const url = `${this.tmdbBaseUrl}/discover/movie?${queryParams}`;
        console.log('Using URL:', url);
    
        try {
            const response = await axios.get(url);
            console.log('Got response:', response.data);
    
            return response.data.results.slice(0, 20).map((movie) => ({
                id: movie.id,
                title: movie.title,
                posterPath: movie.poster_path,
                rating: movie.vote_average,
            }));
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw new Error('Failed to fetch movies from TMDB');
        }
    }
}

export default new RecommendationService();