const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000; // Port for the Express server

// Enable CORS for all routes
app.use(cors());

// Ensure the destination directory exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Set up multer for file uploads with memory storage
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// POST endpoint for single file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  const sessionId = req.query.sessionId; // Get session ID from query parameter
  if (!sessionId) {
    return res.status(400).send('Session ID is required.');
  }
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const uploadPath = path.join('/usr/share/uploads/', sessionId, req.file.originalname);
  ensureDirExists(path.dirname(uploadPath));
  fs.writeFileSync(uploadPath, req.file.buffer);
  console.log('Single file saved on storage:', req.file);
  res.send('File uploaded successfully.');
});

// POST endpoint for multiple file uploads, max 200 files
app.post('/upload-multiple', upload.array('files', 200), (req, res) => {
  const sessionId = req.query.sessionId; // Get session ID from query parameter
  if (!sessionId) {
    return res.status(400).send('Session ID is required.');
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  req.files.forEach((file, index) => {
    console.log('File original name:', file.originalname);
    const relativePath = req.body.relativePaths[index];
    console.log('Relative path:', relativePath);
    const uploadPath = path.join('/usr/share/uploads/', sessionId, relativePath);
    ensureDirExists(path.dirname(uploadPath));
    fs.writeFileSync(uploadPath, file.buffer);
  });

  console.log('Multiple files saved on storage:', req.files);
  res.send('Files uploaded successfully.');
});

// GET endpoint to return a tadm with a given ID
app.get('/tadms/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = `/usr/share/tadms/${fileName}`;
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file.');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});