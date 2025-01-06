const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000; // Port for the Express server

// Enable CORS for all routes
app.use(cors());

// Set up multer for file uploads with original file names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/usr/share/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully.');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});