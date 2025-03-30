const express = require("express");
const router = express.Router();
const databasePool = require("../databaseConnection");
const {convertUTCToTimeZone, convertTimeToUTC} = require("../utils");
const { decode } = require("jsonwebtoken");

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



// Search 
router.get("/search", (req, res) => {

    // Get the parameters to search by.
    const {id, medName, currentQuantity, amountToTake, refillQuantity, dateStarted, daysUntilRefill, takeInterval, timeToTakeAt, isTimeAM, userId} = req.query;

    // Ensure the parameters passed in are valid.
    const validSearchParams = ["id", "medName", "currentQuantity", "amountToTake", "refillQuantity", "dateStarted", "daysUntilRefill", "takeInterval", "timeToTakeAt", "isTimeAM", "userId"];

    for (let passedInParam in req.query) {
        if (!validSearchParams.includes(passedInParam)) {
            return res.status(500).json({error: `Invalid query parameter: ${passedInParam}`});
        }
    }

    // Create the base query.
    let request = "SELECT * FROM medications WHERE 1=1";
    let queryValues = [];

    // Check all search parameters and append to query.
    if (id) {
        request += " AND id = ?";
        queryValues.push(id);
    }

    if (medName) {
        request += " AND MED_NAME = ?";
        queryValues.push(medName);
    }

    if (currentQuantity) {
        request += " AND CURRENT_QUANTITY = ?";
        queryValues.push(currentQuantity);
    }

    if (amountToTake) {
        request += " AND AMOUNT_TO_TAKE = ?";
        queryValues.push(amountToTake);
    }

    if (refillQuantity) {
        request += " AND REFILL_QUANTITY = ?";
        queryValues.push(refillQuantity);
    }

    if (dateStarted) {
        request += " AND DATE_STARTED = ?";
        queryValues.push(dateStarted);
    }

    if (daysUntilRefill) {
        request += " AND TIME_UNTIL_REFILL= ?";
        queryValues.push(daysUntilRefill);
    }

    if (takeInterval) {
        request += " AND TAKE_INTERVAL = ?";
        queryValues.push(takeInterval);
    }

    if (timeToTakeAt) {
        request += " AND TIME_TO_TAKE_AT = ?";
        queryValues.push(timeToTakeAt);
    }

    if (isTimeAM) {
        request += " AND IS_TIME_AM = ?";
        queryValues.push(isTimeAM);
    }

    if (userId) {
        request += " AND USER_ID = ?";
        queryValues.push(userId);
    }

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

// Add
router.post("/add", (req, res) => {

    // Get a connection
    databasePool.getConnection((err,connection) => {

        if (err) {
            return res.status(500).json({error: "Database connection failure:" + err.message});
        }
        
        // Get the JSON package from the request. 
        const {medName, currentQuantity, amountToTake, refillQuantity, dateStarted, takeInterval, timeToTakeAt, isTimeAM, userId} = req.body;
    
        // Init the values array and make sure all the needed values are present.
        let values = [medName, currentQuantity, amountToTake, refillQuantity, dateStarted, takeInterval, timeToTakeAt, isTimeAM, userId];
        let requiredFields = ["medName", "currentQuantity", "amountToTake", "refillQuantity", "dateStarted", "takeInterval", "timeToTakeAt", "isTimeAM", "userId"];

        // Ensure all data is present for new medication and add values to the values array.
        for (let i = 0; i < values.length; i++) {
            if (!values[i]) {
                return res.status(500).json({error: `New medication data ${requiredFields[i]} is missing`});
            }
        }

        
        // The currently logged in user will have entered the time to take at in their respectiove time zone, we must convert it to UTC before storing in the database.
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({error: "No JWT token provided"});
        }  

        // Get the timezone from the jwt token, convert it, and overwrite the entered time in values.
        try {
            const decodedToken = jwt.verify(token); // NEED A KNOWN SECRET KEY HERE TO VERIFY JWT TOKEN.
            const timeZone = decodedToken.timeZone;
            const convertedTime = convertTimeToUTC(values[6], timeZone);
            values[6] = convertedTime;
        } catch (err) {
            return res.status(500).json({error: `Error reading from jwt token: ${err}`}); 
        }

        let request = "INSERT INTO medications (MED_NAME, CURRENT_QUANTITY, AMOUNT_TO_TAKE, REFILL_QUANTITY, DATE_STARTED, TAKE_INTERVAL, TIME_TO_TAKE_AT, IS_TIME_AM, USER_ID) VALUES(?,?,?,?,?,?,?,?,?)";

        connection.query(request, values, (err, results) => {

            connection.release();

            if (err) {
                return res.status(500).json({error: err.message});
            }

            res.json(results);

        });
    });
});

// Delete
router.delete("/delete/:userId/:medName", (req,res) => {

    databasePool.getConnection((err, connection) => {

        if (err) {
            return res.status(500).json({error: "Database connection failure:" + err.message});
        }

        let userId = req.params.userId;
        let medName = req.params.medName;
        let request = "DELETE FROM medications WHERE USER_ID = ? AND MED_NAME = ?";

        connection.query(request, [userId, medName], (err, results) => {

            connection.release();

            if (err) {
                return res.status(500).json({error: err.message});
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({error: `Medication with USER_ID:${userId} and MED_NAME:${medName} not found`});
            }

            res.json({
                message: `Medication with USER_ID:${userId} and MED_NAME:${medName} deleted successfully`,
                deletedRows: results.affectedRows
            });
        }); 
    });
});

// Update
// Need this if we want users to be able to edit med info after entering it.


// Get all medications for a specific user using JWT token
router.get("/usermeds", async (req, res) => {

    // Get the JWT token for the user.
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        // Decode the token.
        const decodedToken = jwt.verify(token, "CHANGE_THIS_KEY");

        // Create the base query.
        let request = "SELECT * FROM medications WHERE USER_ID = ?";
        let values = [decodedToken.userId];

        // Make the query for all the users meds by id
        const results = await asyncDatabaseQuery(request, values);

        console.log("Here is results in the try:", results);

        // Return the results to the front end.
        return res.json(results);

    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
});




module.exports = router;