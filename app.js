/**
 * @fileoverview Main application entry point that sets up Express server and database connection.
 * Configures server middleware, connects to MongoDB, and sets up API routes.
 * @module app
 * @requires express
 * @requires mongoose
 * @requires ./routes/costRoute.js
 * @requires ./routes/userRoute.js
 * @requires ./routes/aboutRoute.js
 */
import express from 'express';
import mongoose from 'mongoose';
import costRoutes from './routes/costRoute.js';
import userRoutes from './routes/userRoute.js';
import aboutRoutes from './routes/aboutRoute.js';
import './db.js'; // Ensures DB connection is initialized

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Register API routes
app.use('/api', costRoutes);         // Cost routes
app.use('/api/users', userRoutes);   // User routes
app.use('/api/about', aboutRoutes);  // About page

// Start the server after successful DB connection
mongoose.connection.once('open', () => {
    console.log("MongoDB connection is open.");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});
