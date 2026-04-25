const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

// storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// static uploads
app.use("/uploads", express.static("uploads"));

// routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "views/upload.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "views/notes.html"));
});

app.post("/upload", upload.single("note"), (req, res) => {
  res.send("File Uploaded Successfully");
});

// server start
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server started on port 3000");
});