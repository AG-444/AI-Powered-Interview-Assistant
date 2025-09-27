import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import mammoth from 'mammoth';
import Candidate from './models/Candidate.js';
import { extractNameFromResume, generateQuestion } from './lib/ai.js'; 
import authRoutes from './routes/auth.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

dotenv.config();

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


// --- API Routes ---
app.use('/api/auth', authRoutes); // Use the new authentication routes

app.get('/', (req, res) => {
  res.send('Hello from the AI Interview Assistant Server!');
});

app.post('/api/candidates', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    let text = '';
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer);
      text = data.text;
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    } else {
      return res.status(400).json({ message: 'Unsupported file type.' });
    }

    // Hybrid Extraction
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    const emailMatch = text.match(emailRegex);
    const phoneMatch = text.match(phoneRegex);

    const extractedInfo = {
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
    };
    
    extractedInfo.name = await extractNameFromResume(text);

    let candidate;
    if (extractedInfo.email) {
      candidate = await Candidate.findOne({ email: extractedInfo.email });
    }

    if (candidate) {
      console.log('Candidate already exists:', candidate);
      candidate.name = extractedInfo.name || candidate.name;
      candidate.phone = extractedInfo.phone || candidate.phone;
      await candidate.save();
    } else {
      candidate = new Candidate({
        name: extractedInfo.name,
        email: extractedInfo.email,
        phone: extractedInfo.phone,
      });
      await candidate.save();
      console.log('New candidate created with hybrid info:', candidate);
    }
    
    res.status(201).json(candidate);

  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ message: 'Server error processing file.' });
  }
});

app.patch('/api/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedCandidate = await Candidate.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }
    console.log("Candidate updated:", updatedCandidate);
    res.json(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ message: 'Server error updating candidate.' });
  }
});

app.post('/api/interview/start', async (req, res) => {
  try {
    const firstQuestion = await generateQuestion('Easy');
    res.json({ question: firstQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start interview.' });
  }
});


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});