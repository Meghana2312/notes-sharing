const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve uploaded files
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

// File upload route
app.post("/upload", upload.single("note"), (req, res) => {
  res.send("File Uploaded Successfully");
});

// IMPORTANT: Use dynamic port for Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});