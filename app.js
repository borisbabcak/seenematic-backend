import express from 'express';
import cors from 'cors';
import moviesRoute from './routes/movies.js';
import authRoute from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/movies', moviesRoute);
app.use('/api/auth', authRoute);

app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    res.status(200).json({ message: 'Test endpoint working!' });
});

export default app;