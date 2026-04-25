const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Serve uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "views/upload.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "views/notes.html"));
});

// API to list files
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) return res.send([]);
    res.json(files);
  });
});

// Upload route
app.post("/upload", upload.single("note"), (req, res) => {
  res.send("File Uploaded Successfully <br><a href='/'>Go Home</a>");
});

// Health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});