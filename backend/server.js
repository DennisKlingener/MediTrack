const express = require("express");
const path = require("path");
const userRouter = require("./routes/users");
const medicationRouter = require("./routes/medications");

const app = express();
app.use(express.json());

// Import the cron jobs for the server.
require("./cronJobs");

// API routes
// Note: API rputes must be defined before the catch all "*" for index.html.
// This is because express checks the routes in the order of which they are defined,
// so if the catch all is first, it will catch all the requests and return index.html
// for all of them, and our API routes will never be used.
app.use("/routes/users", userRouter);
app.use("/routes/medications", medicationRouter);

// Serve the frontend static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route to serve `index.html` for React SPA (Single Page Application)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
