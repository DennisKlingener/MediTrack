require("dotenv").config();
const mySQL = require("mysql2");

// A connection pool automatically manages "connectionLimit" connections to the databse
// and handles recreating new connections when old ones timeout.
const databasePool = mySQL.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,  // Make a user that is not root...
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    queueLimit: 0,
});

// Export the database connection for use in the endpoints.
module.exports = databasePool;