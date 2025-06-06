/**
    @file models/cost.js,
    @description This file defines the Mongoose schema for the 'Cost' collection in the MongoDB
    database.It specifies the structure and data types of cost-related documents, including
    properties, such as description, category, userid, sum, and createdAt.
 */

const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sport', 'education']
    },
    userid: {
        type: Number,
        required: true
    },
    sum: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cost', costSchema);
