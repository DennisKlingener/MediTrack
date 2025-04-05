const cron = require("node-cron");
const nodemailer = require('nodemailer');
require("dotenv").config();
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

function getAndConfigureTime() {
    
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

    return [currentHour, isAM];
}


// Update all the values for medications who time to take is the current hour
cron.schedule("0 * * * *", async () => {

    const timeInfo = getAndConfigureTime();

    // Query for all table entries whos time to take matches the current hour.
    const selectRequest = "SELECT * FROM medications WHERE TIME_TO_TAKE_AT = ? AND IS_TIME_AM = ?";
    let values = [(timeInfo[0] > 9) ? `${timeInfo[0]}:00:00` : `0${timeInfo[0]}:00:00`, (timeInfo[1]) ? 1 : 0];

    console.log("here is values:", values);

    // async query. array of medications needed to be taken 
    const results = await asyncDatabaseQuery(selectRequest, values);

    // Make allthe neccesary updates to the returned results.
    const updateRequest = "UPDATE medications SET CURRENT_QUANTITY = ? WHERE USER_ID = ? AND MED_NAME = ?";
    const promises = [];

    for (let row of results) {

        // Get the needed data from the row.
        let currentQuantity = (row.CURRENT_QUANTITY - row.AMOUNT_TO_TAKE);
        let userId = row.USER_ID;
        let medName = row.MED_NAME;

        console.log("here is row: ", row);
        console.log("Here was current quantity: ", currentQuantity);
        console.log("Here is user id: ", userId);
        console.log("Here is medName: ", medName);

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

// Send emails to all the users that have a medication to take at the current hour.
cron.schedule("* * * * *", async () => {

    const timeInfo = getAndConfigureTime();

    // Query for all table entries whos time to take matches the current hour.
    const selectRequest = "SELECT * FROM medications WHERE TIME_TO_TAKE_AT = ? AND IS_TIME_AM = ?";
    let values = [(timeInfo[0] > 9) ? `${timeInfo[0]}:00:00` : `0${timeInfo[0]}:00:00`, (timeInfo[1]) ? 1 : 0];

    // async query. array of medications needed to be taken 
    const results = await asyncDatabaseQuery(selectRequest, values);

    // Get the users thatneed t notified from the uiserid in the medications returned.
    for (let row of results) {

        // Set the request
        const request = "SELECT * FROM users WHERE id = ?";
        let userId = row.USER_ID;

        // Make a request.
        const results = await asyncDatabaseQuery(request, [userId]);

        // Get the users email
        let userEmail = results[0].EMAIL;

        // Send an email tot he user    
        const emailConnection = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "meditrackreminder@gmail.com",
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        emailConnection.sendMail({
            from: "meditrackreminder@gmail.com",
            to: userEmail,
            subject: "MediTrack Reminder",
            text: "This is a reminder to take your meds!"
        }, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
        });
    }
});



// cron to check for refills needed soon.
