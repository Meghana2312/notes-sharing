const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================

// Home page
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to Notes Sharing App 🚀</h1>
    <a href="/upload">Upload Notes</a><br><br>
    <a href="/notes">View Notes</a><br><br>
    <a href="/about">About Project</a>
  `);
});

// Upload page
app.get("/upload", (req, res) => {
  res.send(`
    <h2>Upload Notes</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="note" required />
      <button type="submit">Upload</button>
    </form>
    <br><a href="/">Go Home</a>
  `);
});

// Handle file upload
app.post("/upload", upload.single("note"), (req, res) => {
  res.send(`
    <h2>File Uploaded Successfully ✅</h2>
    <a href="/notes">View Notes</a><br><br>
    <a href="/">Go Home</a>
  `);
});

// View notes
app.get("/notes", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.send("Error reading files");
    }

    const fileList = files
      .map(file => `<a href="/uploads/${file}" target="_blank">${file}</a>`)
      .join("<br>");

    res.send(`
      <h1>Uploaded Notes</h1>
      ${fileList || "No files uploaded yet"}
      <br><br>
      <a href="/">Go Home</a>
    `);
  });
});

// About (Cloud explanation)
app.get("/about", (req, res) => {
  res.send(`
    <h1>About Project</h1>
    <p>This is a Cloud-Based Notes Sharing Application.</p>
    <p>The application is deployed on cloud using Render.</p>
    <p>Users can upload and access notes from anywhere.</p>
    <p>This project follows SaaS (Software as a Service).</p>
    <br>
    <a href="/">Go Home</a>
  `);
});

// Health check (for deployment platforms)
app.get("/health", (req, res) => {
  res.send("OK");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});