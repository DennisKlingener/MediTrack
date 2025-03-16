const express = require("express");
const router = express.Router();
const databasePool = require("../databaseConnection");

// Express function that parses incoming JSON
router.use(express.json());

// Port that the server is running on.
// Do the backend and frontend need to be on different ports?
const PORT = process.env.PORT || 5000;

// Get all users
router.get("/", (req, res) => {

    // Get a database connection from the connection pool.
    databasePool.getConnection((err, connection) => {

        if (err) {
            return res.status(500).json({error: "Database connection failure:" + err.message});
        }

        connection.query("SELECT * FROM users", (err, results) => {

            // Release the connection
            connection.release();

            // If there is an error set the status to 500 and return
            // the JSON of the error.
            if (err) {
                return res.status(500).json({error: err.message});
            }

            // If no error, return the results JSON.
            res.json(results);

        });
    });
});

module.exports = router;