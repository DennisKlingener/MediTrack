const express = require("express");
const router = express.Router();
const databasePool = require("../databaseConnection");

// Express function that parses incoming JSON
router.use(express.json());

// Port that the server is running on.
// Do the backend and frontend need to be on different ports?
const PORT = process.env.PORT || 5000; // Do we need this...

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
            return res.status(500).json({error: `Invalid query parameter: ${passedInParam}`});
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
router.post("/add", (req, res) => {

    // Get a connection 
    databasePool.getConnection((err, connection) => {
        
        if (err) {
            return res.status(500).json({error: "Database connection failure:" + err.message});
        }

        // Get the json from the request.
        const {firstName, lastName, userName, password, phoneNumber, email} = req.body;

        // Init the values array and field names to ensure all required fields are present.
        let values = [firstName, lastName, userName, password, phoneNumber, email];
        let requiredFields = ["firstName", "lastName", "userName", "password", "phoneNumber", "email"];

        // Ensure all data is present for new user and add values to the values array.
        for (let i = 0; i < values.length; i++) {
            if (!values[i]) {
                return res.status(500).json({error: `New user data ${requiredFields[i]} is missing`});
            }
        }

        // Contruct the sql insert statement.
        let request = "INSERT INTO users (FIRST_NAME, LAST_NAME, USER_NAME, PASSWORD, PHONE_NUMBER, EMAIL) VALUES (?,?,?,?,?,?)";

        // Execute the statement.
        connection.query(request, values, (err, results) => {

            connection.release();

            if (err) {
                return res.status(500).json({error: err.message});
            }

            res.json(results);
        });
    });
});

// Remove user associated with the passed in id.
router.delete("/delete/:id", (req, res) => {

    databasePool.getConnection((err, connection) => {

        if (err) {
            return res.status(500).json({error: "Database connection failure:" + err.message});
        }

        // Prepare the statement.
        let userID = req.params.id;
        let request = "DELETE FROM users WHERE id = ?";

        // Execute the statement.
        connection.query(request, [userID], (err, results) => {

            connection.release();

            if (err) {
                return res.status(500).json({error: err.message});
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({error: `User with ${userID} not found`});
            }
            
            res.json({
                message: `User with ID ${userID} deleted successfully`,
                deletedRows: results.affectedRows
            });
        });
    });
});

// Edit user... not 100% needed...

module.exports = router;