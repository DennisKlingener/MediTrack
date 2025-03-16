const express = require("express");
const router = express.Router();
const databasePool = require("../databaseConnection");

// Express function that parses incoming JSON
router.use(express.json());

// Port that the server is running on.
// Do the backend and frontend need to be on different ports?
const PORT = process.env.PORT || 5000; // Do we need this...

router.get("/search", (req, res) => {

    // Get the parameters to search by.
    const {id, medName, currentQuantity, amountToTake, refillQuantity, dateStarted, timeUntilRefill, takeInterval, userId} = req.query;

    // Ensure the parameters passed in are valid.
    const validSearchParams = ["id", "medName", "currentQuantity", "amountToTake", "refillQuantity", "dateStarted", "timeUntilRefill", "takeInterval", "userId"];

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

    if (timeUntilRefill) {
        request += " AND TIME_UNTIL_REFILL= ?";
        queryValues.push(timeUntilRefill);
    }

    if (takeInterval) {
        request += " AND TAKE_INTERVAL = ?";
        queryValues.push(takeInterval);
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




module.exports = router;