const express = require('express');
const moviesRoute = require('./routes/movies');

const app = express();
app.use(express.json());

app.use('/api/movies', moviesRoute);

module.exports = app;