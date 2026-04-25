const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();

// Serve static files
app.use(express.static("views"));

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

// HOME PAGE (IMPORTANT FIX)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// Upload route
app.post("/upload", upload.single("note"), (req, res) => {
  res.send("File Uploaded Successfully");
});

// Health route (for Render)
app.get("/health", (req, res) => {
  res.send("OK");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});