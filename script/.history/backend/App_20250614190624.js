const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');

app.use(express.json());

app.use('/users', userRoutes);

module.exports = app;
