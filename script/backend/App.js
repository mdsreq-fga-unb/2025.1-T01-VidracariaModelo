const express = require('express');
const app = express();
const userRoutes = require('./Routes/user_routes.tsx');

app.use(express.json());

app.use('/users', userRoutes);

module.exports = app;
