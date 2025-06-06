/**
 * @file controllers/costController.js
 * @description This controllers manages operations related to costs – including adding a new cost entry and generating a monthly summary.
 */

const Cost = require('../models/cost');
const User = require('../models/user');

class CostController {
    /**
     * Handle adding a new cost entry.
     * Endpoint: POST /api/add
     * Expected request body parameters:
     * - userid: The user's unique identifier
     * - description: Details of the expense
     * - category: One of the defined categories (food, health, housing, sport, education)
     * - sum: Cost amount
     * - createdAt (optional): Timestamp of when the expense occurred
     * @param {Object} req - HTTP request object
     * @param {Object} res - HTTP response object
     */
    async addCost(req, res) {
        console.log('POST /api/add request received with body:', req.body);
        try {
            // Extract relevant fields from request body
            const { userid, description, category, sum, createdAt } = req.body;

            // Ensure required fields are not missing
            if (!userid || !description || !category || !sum) {
                console.log('One or more required fields are missing.');
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // List of valid categories
            const ALLOWED_CATEGORIES = ['food', 'health', 'housing', 'sport', 'education'];
            if (!ALLOWED_CATEGORIES.includes(category)) {
                console.log('Category not recognized:', category);
                return res.status(400).json({ error: 'Invalid category', validCategories: ALLOWED_CATEGORIES });
            }

            // Confirm the user exists in the system
            const existingUser = await User.findOne({ id: Number(userid) });
            if (!existingUser) {
                console.log('No user found with ID:', userid);
                return res.status(404).json({ error: 'User not found' });
            }

            // Construct the cost record
            const costEntry = new Cost({
                userid,
                description,
                category,
                sum,
                createdAt: createdAt ? new Date(createdAt) : undefined // Default to current timestamp if not provided
            });

            // Save the cost entry to the database
            const savedEntry = await costEntry.save();
            console.log('Cost successfully added:', savedEntry);

            // Respond with the created cost record
            return res.json(savedEntry);
        } catch (err) {
            console.error('Unexpected error in addCost:', err);
            return res.status(500).json({ error: 'Server error', message: err.message });
        }
    }

    /**
     * Generate a report summarizing a user's expenses for a specific month.
     * Endpoint: GET /api/report?id=...&year=...&month=...
     * Required query parameters:
     * - id: The user's ID
     * - year: The desired year
     * - month: The desired month
     * Returns a categorized breakdown of expenses for the given month and user.
     * @param {Object} req - HTTP request object
     * @param {Object} res - HTTP response object
     */
    async getMonthlyReport(req, res) {
        console.log('GET /api/report called with query params:', req.query);
        try {
            // Destructure and validate query parameters
            const { id, year, month } = req.query;

            if (!id || !year || !month) {
                console.log('Missing query parameters: id, year, or month');
                return res.status(400).json({ error: 'Missing required query parameters: id, year, month' });
            }

            const parsedId = Number(id);
            const parsedYear = Number(year);
            const parsedMonth = Number(month);

            if (isNaN(parsedId) || isNaN(parsedYear) || isNaN(parsedMonth)) {
                console.log('Query parameters must be valid numbers');
                return res.status(400).json({ error: 'Query parameters id, year, and month must be numbers' });
            }

            // Validate user existence
            const userFound = await User.findOne({ id: parsedId });
            if (!userFound) {
                console.log('User not located with ID:', parsedId);
                return res.status(404).json({ error: 'User not found' });
            }

            // Determine the date boundaries for the report
            const rangeStart = new Date(parsedYear, parsedMonth - 1, 1);
            const rangeEnd = new Date(parsedYear, parsedMonth, 1);

            // Retrieve all cost records within the specified month
            const userCosts = await Cost.find({
                userid: parsedId,
                createdAt: { $gte: rangeStart, $lt: rangeEnd }
            });

            const categoryList = ['food', 'health', 'housing', 'sport', 'education'];
            const groupedResults = {};

            // Organize costs by category
            categoryList.forEach(cat => {
                groupedResults[cat] = userCosts
                    .filter(entry => entry.category === cat)
                    .map(entry => ({
                        sum: entry.sum,
                        description: entry.description,
                        day: new Date(entry.createdAt).getDate()
                    }));
            });

            // Prepare final report structure
            const reportPayload = {
                userid: parsedId,
                year: parsedYear,
                month: parsedMonth,
                costs: groupedResults
            };

            return res.json(reportPayload);
        } catch (err) {
            console.error('Unexpected error in getMonthlyReport:', err);
            return res.status(500).json({ error: 'Server error', message: err.message });
        }
    }
}

module.exports = new CostController(); // Exporting an instance of the controllers
