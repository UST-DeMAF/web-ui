const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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

// POST endpoint for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully.');
});

// GET endpoint to return a tadm with a given ID
app.get('/tadms/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join('/usr/share/tadms', fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found.');
    }

    res.sendFile(filePath);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});