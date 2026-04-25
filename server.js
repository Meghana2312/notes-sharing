const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static("views"));

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer setup for file uploads
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
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// Upload page
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "views/upload.html"));
});

// Notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "views/notes.html"));
});

// Upload API
app.post("/upload", upload.single("note"), (req, res) => {
  res.send("File Uploaded Successfully ✅ <br><a href='/'>Go Home</a>");
});

// Health check (important for Render)
app.get("/health", (req, res) => {
  res.send("OK");
});


// ================= SERVER =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});