/**
    @file models/user.js
    @description This file defines the Mongoose schema for the 'User' collection in the MongoDB
    database.The schema outlines the structure of each user document, including fields such as id,
    first_name, last_name, birthday, and marital_status. The schema is compiled into a Mongoose model
    and exported for use in controllers and routes.
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    marital_status: {
        type: String,
        required: true,
        enum: ['single', 'married', 'divorced', 'widowed'],
        default: 'single'
    }
});
module.exports = mongoose.model('User', userSchema);
