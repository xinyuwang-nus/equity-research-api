const express = require('express');

const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

/**
 * @route   /reports
 * @desc    Routes for handling report-related actions
 */
app.use('/reports', reportRoutes);

/**
 * @route   /auth
 * @desc    Routes for user signup and login
 */
app.use('/auth', authRoutes);

module.exports = app;
