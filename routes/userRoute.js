/**
 * @file routes/userRoute.js
 * @description Routes for handling users – defines the route for retrieving user details by ID.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get user details: GET /api/users/:userId
// The ':' before 'userId' in the route path indicates that 'userId' is a dynamic parameter in the URL.
router.get('/:userId', userController.getUserDetails);

module.exports = router;
