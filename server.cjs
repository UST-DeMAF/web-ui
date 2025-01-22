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

// Set up multer for file uploads with original file names and directory structure
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join('/usr/share/', path.dirname(file.originalname));
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, path.basename(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST endpoint for single file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log('Single file saved on storage:', req.file);
  res.send('File uploaded successfully.');
});

// POST endpoint for multiple file uploads, max 200 files
app.post('/upload-multiple', upload.array('files', 200), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  req.files.forEach(file => {
    const relativePath = file.originalname;
    const uploadPath = path.join('/usr/share/', relativePath);
    ensureDirExists(path.dirname(uploadPath));
    fs.writeFileSync(uploadPath, file.buffer);
  });

  console.log('Multiple files saved on storage:', req.files);
  res.send('Files uploaded successfully.');
});

// GET endpoint to return a tadm with a given ID
app.get('/tadms/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = `/usr/share/${fileName}`;
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