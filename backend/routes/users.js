const express = require("express");
const router = express.Router();
const databasePool = require("../databaseConnection");
const jwt = require('jsonwebtoken');

// Express function that parses incoming JSON
router.use(express.json());

// Port that the server is running on.
// Do the backend and frontend need to be on different ports?
const PORT = process.env.PORT || 5000; // Do we need this...

// PUT THIS IN UTILS. THIS IS REWRITTEN CODE BAD BAD BAD
async function asyncDatabaseQuery(request, values) {
    try {
        const results = await new Promise((resolve, reject) => {
            databasePool.getConnection((err, connection) => {
                if (err) reject(err);
                connection.query(request, values, (err, results) => {
                    connection.release();
                    if (err) reject(err);
                    resolve(results);
                });
            });
        });

        return results;
    } catch (err) {
        console.log("Error in asyncDatabaseQuery: ", err);
    }
}

function createJWTToken(user) {

    const payload = {
        userId: user.id,
        firstName: user.FIRST_NAME,
        lastName: user.LAST_NAME,
        userName: user.USER_NAME,
        password: user.PASSWORD,
        phoneNumber: user.PHONE_NUMBER,
        email: user.EMAIL,
        timeZone: user.TIMEZONE
    }

    // const secretKey = "CHANGE_THIS_KEY";

    // const token = jwt.sign(payload, secretKey, {expiresIn: "2h"});

    return payload;
}

// Get user with paramters {[para: meters]}
// One search functin for users. Appended where clause to the end of
// SELECT * FROM users WHERE <parameters>;
router.get("/search", (req, res) => {

    // Get the passed in parameters to search by.
    const {id, firstName, lastName, userName, password, phoneNumber, email, timeZone} = req.query;

    // Ensure the parameters passed in are valid.
    const validSearchParams = ["id", "firstName", "lastName", "userName", "password", "phoneNumber", "email", "timeZone"];

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

    if (timeZone) {
        request += " AND TIMEZONE = ?";
        queryValues.push(timeZone);
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

// Login
router.post("/login", async (req, res) => {
    
    // Get the json from the login request.
    const {userName, password} = req.body;

    // Init the values array and field names to ensure all required fields are present.
    let values = [userName, password];
    let requiredFields = ["userName", "password"];

    // Ensure all data is present for user login and add values to the values array.
    for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
            return res.status(500).json({error: `Login data ${requiredFields[i]} is missing`});
        }
    }

    // Make an async query.
    const request = "SELECT * FROM users WHERE USER_NAME = ?";
    const results = await asyncDatabaseQuery(request, values);
    

    console.log(results);


    // Check that the password passed to this endpoint matches the password found from the query.
    if (values[1] == results[0].PASSWORD) {

        // Need to init a jwt token with the users information and return a success statment back the frontend here. 
        console.log("passwords match!");

        const token = createJWTToken(results[0]);

        // Store the token in a http cookie.
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.status(200).json({
            "loginComplete": true,
            "message": "LOGIN_COMPLETE"
        });
    } else {
        // Here the password was incorrect, send back a failure.
        console.log("passwords dont match!");

        return res.status(200).json({
            "loginComplete": false,
            "message": "INCORRECT_PASSWORD"
        });
    }
});

// Add user
router.post("/add", async (req, res) => {

    // Get the json from the request.
    const {firstName, lastName, userName, password, phoneNumber, email, timeZone} = req.body;

    // Init the values array and field names to ensure all required fields are present.
    let values = [firstName, lastName, userName, password, phoneNumber, email, timeZone];
    let requiredFields = ["firstName", "lastName", "userName", "password", "phoneNumber", "email", "timeZone"];

    // Ensure all data is present for new user
    for (let i = 0; i < values.length; i++) {
        if (!values[i]) {
            return res.status(500).json({error: `New user data ${requiredFields[i]} is missing`});
        }
    }

    // Contruct the sql insert statement.
    let request = "INSERT INTO users (FIRST_NAME, LAST_NAME, USER_NAME, PASSWORD, PHONE_NUMBER, EMAIL, TIMEZONE) VALUES (?,?,?,?,?,?,?)";

    const results = await asyncDatabaseQuery(request, values);

    // add user should be complete....
    if (results) {
        return res.status(200).json({
            "signUpComplete": true,
            "message": "USER_ADDED"
        });
    } else {
        return res.status(500).json({
            "signUpComplete": false,
            "message": "ADD_USER_FAILURE"
        });
    } 
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