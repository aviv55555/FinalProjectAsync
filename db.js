
/**
 * @fileoverview MongoDB connection module using Mongoose.
 * This file is imported at the root of the app to initialize database connection.
 * @module db
 * @requires mongoose
 */

import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://aviv0205:z3TnGb6uVh8rb9Mn@costmanagerdb.533fjm1.mongodb.net/costManagerRESTful?retryWrites=true&w=majority&appName=costManagerDB";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB (from db.js)");
}).catch((err) => {
    console.error("MongoDB connection failed (from db.js):", err);
});
