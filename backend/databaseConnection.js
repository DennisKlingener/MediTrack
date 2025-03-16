require("dotenv").config();
const mySQL = require("mysql2");

// Create a connection for the database.
const database = mySQL.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,  // Make a user that is not root...
    // password: process.env.DB_PASSWORD, Implement password...
    database: process.env.DB_NAME,
});

// Connect to the database.
database.connect((err) => {
    if (err) {
        console.error("Failure to connect to database: ", err.stack);
        return;
    }
    console.log("Successfully connected to database.");
});

// Export the database connection for use in the endpoints.
module.exports = database;