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

// Get user with paramters {[para: meters]}
// One search functin for users. Appended where clause to the end of
// SELECT * FROM users WHERE <parameters>;
router.get("/search", (req, res) => {

    // Get the passed in parameters to search by.
    const {id, firstName, lastName, userName, password, phoneNumber, email} = req.query;

    // Ensure the parameters passed in are valid.
    const validSearchParams = ["id", "firstName", "lastName", "userName", "password", "phoneNumber", "email"];

    for (let passedInParam in req.query) {
        if (!validSearchParams.includes(passedInParam)) {
            return res.status(400).json({error: `Invalid query parameter: ${passedInParam}`});
        }
    }

    // Create the base query.
    let request = "SELECT * FROM users WHERE 1=1";
    let queryValues = [];


    // Check all search parameters and append to the query.
    if (id) {
        request += " AND id = ?";
        queryValues.push(id);
    }

    if (firstName) {
        request += " AND FIRST_NAME = ?";
        queryValues.push(firstName);
    }

    if (lastName) {
        request += " AND LAST_NAME = ?";
        queryValues.push(lastName);
    }

    if (userName) {
        request += " AND USER_NAME = ?";
        queryValues.push(userName);
    }

    if (password) {
        request += " AND PASSWORD = ?";
        queryValues.push(password);
    }

    if (phoneNumber) {
        request+= " AND PHONE_NUMBER = ?";
        queryValues.push(phoneNumber);
    }

    if (email) {
        request += " AND EMAIL = ?";
        queryValues.push(email);
    }

    // Get a connection from the pool and make the request.
    databasePool.getConnection((err, connection) => {

        if (err) {
            return res.status(500).json({error: "Database connection failure:" + err.message});
        }

        connection.query(request, queryValues, (err,results) => {
        
            connection.release();

            if (err) {
                return res.status(500).json({error: err.message});
            }

            res.json(results);

        });
    });
});










// Add user


// Remove user




// Edit user















































module.exports = router;