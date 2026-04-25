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

// =======================
// ROUTES
// =======================

//  Root route (for Railway check)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Health route (for Railway)
app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

//  Upload page (optional if you have HTML)
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "views/upload.html"));
});

// Notes page (optional)
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "views/notes.html"));
});

// File upload
app.post("/upload", upload.single("note"), (req, res) => {
  res.send("File Uploaded Successfully");
});

// =======================
// SERVER START
// =======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});