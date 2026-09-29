require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('Database URI:', process.env.MONGODB_URI);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:');
    console.error('Message:', err.message);
    console.error('URI:', process.env.MONGODB_URI);
    console.error('Full Error:', err);
  });

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/ai', require('./src/routes/ai.routes'));

// Multer setup
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// PDF Resume Parser
const { PdfReader } = require('pdfreader');

app.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const extractText = (buffer) => {
      return new Promise((resolve, reject) => {
        let text = ''
        new PdfReader().parseBuffer(buffer, (err, item) => {
          if (err) {
            reject(err)
          } else if (!item) {
            resolve(text)
          } else if (item.text) {
            text += item.text + ' '
          }
        })
      })
    }

    const text = await extractText(req.file.buffer)
    console.log('✅ PDF parsed, length:', text.length)
    res.json({ text })
  } catch (error) {
    console.error('PDF parse error:', error.message)
    res.status(500).json({ error: 'PDF parsing failed: ' + error.message })
  }
});

// Profile Picture Upload
const { protect } = require('./src/middleware/auth');
const User = require('./src/models/User');

app.post('/api/users/upload-photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' })
    }

    console.log('📸 Photo upload received, size:', req.file.size)

    const base64 = req.file.buffer.toString('base64')
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`

    await User.findByIdAndUpdate(req.user.id, { profilePicture: dataUrl })

    console.log('✅ Photo saved for user:', req.user.id)
    res.json({ profilePicture: dataUrl })
  } catch (error) {
    console.error('❌ Photo upload error:', error.message)
    res.status(500).json({ error: 'Failed to upload photo' })
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));