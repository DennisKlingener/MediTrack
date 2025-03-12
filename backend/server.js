const express = require("express");
const path = require("path");

const app = express();

// Serve the frontend static files
app.use(express.static(path.join(__dirname, "../frontend/dist"))); // If using Vite
// app.use(express.static(path.join(__dirname, "../frontend/build"))); // If using Create React App

// Catch-all route to serve `index.html` for React SPA (Single Page Application)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html")); // Adjust if using Create React App
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
