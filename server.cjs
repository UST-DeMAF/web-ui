const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const configPath = path.join(__dirname, 'dist/config.json'); // Path to the config file
const port = 8079; // Port for the Express server

// Enable CORS for all routes
app.use(cors());

// Serve the static files of the Vue.js frontend
app.use(express.static('dist'));

// Function to load the configuration from the config.json file
function getConfig() {
  try {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);
  } catch (error) {
      console.error('Error loading config.json:', error);
      return { DEMAF_ANALYSIS_MANAGER_URL: 'http://analysismanager:8080' }; // Fallback
  }
}

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

// POST endpoint for multiple file uploads, max 1000 files
app.post('/upload-multiple', upload.array('files', 1000), (req, res) => {
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

// Proxy middleware for the Analysis Manager
app.use('/analysismanager', (req, res, next) => {
  const config = getConfig();
  const target = config.DEMAF_ANALYSIS_MANAGER_URL;
  createProxyMiddleware({
    target,
    pathRewrite: { '^/analysismanager': '' } // Removes the prefix from the path
  })(req, res, next);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});