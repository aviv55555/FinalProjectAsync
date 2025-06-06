/**
    @file controllers/userController.js,
    @description This controllers handles the retrieval of a user's basic details by ID,
    including a dynamic calculation of the total amount spent by the user.
*/

const User = require('../models/user');
const Cost = require('../models/cost');

class UserController {
    /*
        Get user details and total spending by ID.
        Endpoint: GET /api/users/:userId,
        @param {Object} req - The HTTP request object,
        @param {Object} res - The HTTP response object,
        @returns {Object} JSON with: first_name, last_name, id, total
    */
    async getUserDetails(req, res) {
        try {// Parse and validate user ID
            const userId = Number(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({error: 'Invalid user ID'});
            }

            // Find the user in the database
            const user = await User.findOne({id: userId});
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }

            // Retrieve all cost documents for the user
            const userCosts = await Cost.find({userid: userId});

            // Calculate the total sum of all costs
            const total = userCosts.reduce((acc, cost) => acc + cost.sum, 0);

            // Construct the response object
            const result = {
                first_name: user.first_name,
                last_name: user.last_name,
                id: user.id,
                total: total
            };

            // Return the result in JSON format
            return res.json(result);

        } catch (error) {
            // Internal server error handling
            console.error('Error in getUserDetails:', error);
            return res.status(500).json({error: 'Internal server error', message: error.message});
        }
    }
}

module.exports = new UserController();