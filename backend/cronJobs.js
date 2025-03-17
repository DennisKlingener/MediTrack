const cron = require("node-cron");
const databasePool = require("./databaseConnection");

// NOTE: FOR RIGHT NOW WE ARE RESTRICTED TO EVEN HOUR ONLY TIME TO TAKE MEDS. IE: 9:00, 3:00, 4:00 OR EVERY N HOURS. 
// WE CAN CHANGE THIS LATER BY CHANGING THE FREQUENCY OF THESE CRON JOBS.

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

// Checks all entries that have a TIME_TO_TAKE_VALUE.
cron.schedule("0 * * * *", async () => {

    // Get all the entires whos time to take is equal to the current time.

    // Get the current time.
    const currentTime = new Date();
    let currentHour = currentTime.getHours();
    let isAM = false;

    // Check if AM or PM and mod if needed.
    if (currentHour <= 11) {
        isAM = true;
    } else if (currentHour == 24) {
        isAM = true;
        currentHour = 1;
    } else {
        isAM = false;
        currentHour = (currentHour % 12);
    }

    // Query for all table entries whos time to take matches the current hour.
    const selectRequest = "SELECT * FROM medications WHERE TIME_TO_TAKE_AT = ? AND IS_TIME_AM = ?";
    let values = [(currentHour > 9) ? `${currentHour}:00:00` : `0${currentHour}:00:00`, (isAM) ? 1 : 0];

    // async query.
    const results = await asyncDatabaseQuery(selectRequest, values);
    
    // AT THIS POINT WE WOULD NEED TO IMPLEMENT A METHOD THAT GETS THE PHONE NUMBER OF THE USERS IN THE RETURNED RESUSLTS AND SEND THEM A TEXT MESSAGE!!!!

    // Make allthe neccesary updates to the returned results.
    const updateRequest = "UPDATE medications SET CURRENT_QUANTITY = ? WHERE USER_ID = ? AND MED_NAME = ?";
    const promises = [];

    for (let row of results) {

        // Get the needed data from the row.
        let currentQuantity = (row.CURRENT_QUANTITY - row.AMOUNT_TO_TAKE);
        let userId = row.USER_ID;
        let medName = row.MED_NAME;

        // Clear and set values
        values.length = 0;
        values.push(currentQuantity, userId, medName);

        // Make the query.
        const promise = new Promise((resolve, reject) => {
            databasePool.getConnection((err, connection) => {
                if (err) reject(err);
                connection.query(updateRequest, values, (err, results) => {
                    connection.release();
                    if (err) reject(err);
                    resolve(results);
                });
            });
        })

        promises.push(promise);
    }

    // Wait for all the promises to complete.
     try {
        await Promise.all(promises);
        console.log("All updates complete.");
    } catch (err) {
        console.error("Error updating medications:", err);      // Might want to implement some kind of error recovery!
    }
});

// cron to check time interval

// cron to check for refills needed soon.
