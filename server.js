const express = require("express");
const multer = require("multer");
const fs = require("fs");

const app = express();

// ================== CREATE UPLOADS FOLDER ==================
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ================== MULTER SETUP ==================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ================== STATIC FILES ==================
app.use("/uploads", express.static("uploads"));

// ================== HOME ==================
app.get("/", (req, res) => {
  res.send(`
    <h1>📚 Notes Sharing App 🚀</h1>
    <a href="/upload">Upload Notes</a><br><br>
    <a href="/notes">View Notes</a><br><br>
    <a href="/about">About Project</a>
  `);
});

// ================== UPLOAD PAGE ==================
app.get("/upload", (req, res) => {
  res.send(`
    <h2>Upload Notes</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="note" required />
      <button type="submit">Upload</button>
    </form>
    <br><br>
    <a href="/">Go Home</a>
  `);
});

// ================== HANDLE UPLOAD ==================
app.post("/upload", upload.single("note"), (req, res) => {
  res.send(`
    <h2>File Uploaded Successfully ✅</h2>
    <a href="/notes">View Notes</a><br><br>
    <a href="/">Go Home</a>
  `);
});

// ================== VIEW NOTES ==================
app.get("/notes", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.send("Error reading files");
    }

    let fileList = "";

    files.forEach(file => {
      fileList += `<a href="/uploads/${file}" target="_blank">${file}</a><br>`;
    });

    res.send(`
      <h1>Uploaded Notes</h1>
      ${fileList || "No files uploaded yet"}
      <br><br>
      <a href="/">Go Home</a>
    `);
  });
});

// ================== ABOUT (FIXED) ==================
app.get("/about", (req, res) => {
  res.send(`
    <h1>About Project</h1>
    <p>This is a Cloud-Based Notes Sharing Application.</p>
    <p>The app is deployed on cloud using Render.</p>
    <p>Users can upload and access notes from anywhere.</p>
    <p>This follows SaaS (Software as a Service).</p>
    <br><br>
    <a href="/">Go Home</a>
  `);
});

// ================== HEALTH CHECK ==================
app.get("/health", (req, res) => {
  res.send("OK");
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});