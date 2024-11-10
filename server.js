require('dotenv').config();
import express, { json } from 'express';
import connectDB from './config/db';

const app = express();
connectDB();

app.use(json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));