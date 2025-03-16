const express = require("express");
const database = require("../databaseConnection");
const app = express();

// Express function that parses incoming JSON
app.use(express.json());

// Port that the server is running on.
// Do the backend and frontend need to be on different ports?
const PORT = process.env.PORT || 5000;

// Get all users
app.get("/routes/users", (req, res) => {
    database.query("SELECT * FROM users", (err, results) => {
        // If there is an error set the status to 500 and return
        // the JSON of the error.
        if (err) {
            return res.status(500).json({error: err.message});
        }
        // If no error, return the results JSON.
        res.json(results);
    });
});

module.exports = userRoutes;