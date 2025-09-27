import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import mammoth from 'mammoth';
import Candidate from './models/Candidate.js';

// --- Corrected PDF-Parse Import ---
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
// ------------------------------------

dotenv.config();

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

// --- Helper function to extract info ---

const extractInfo = (text) => {
  const info = {};

  // Regex to find email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    info.email = emailMatch[0];
  }

  // Regex to find phone number
  const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    info.phone = phoneMatch[0];
  }

  // A slightly smarter way to find the name:
  // Look for a line with 2-3 capitalized words near the top.
  const lines = text.split(/\r?\n/).slice(0, 10); // Check the first 10 lines
  const nameRegex = /^[A-Z][a-z]+(\s[A-Z][a-z]+){1,2}$/;
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (nameRegex.test(trimmedLine)) {
      info.name = trimmedLine;
      break; // Stop after finding the first likely name
    }
  }

  // If the regex didn't find a name, fall back to the first line
  if (!info.name && lines.length > 0) {
    info.name = lines[0].trim();
  }

  return info;
};


// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Hello from the AI Interview Assistant Server!');
});

// In server/index.js

app.post('/api/candidates', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    let text = '';
    // File parsing logic...
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer);
      text = data.text;
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    } else {
      return res.status(400).json({ message: 'Unsupported file type.' });
    }

    const extractedInfo = extractInfo(text);
    let candidate;

    // --- CORRECTED LOGIC ---
    // If we found an email, try to find the candidate. Otherwise, create a new one.
    if (extractedInfo.email) {
      candidate = await Candidate.findOne({ email: extractedInfo.email });
    }

    if (candidate) {
      // If candidate exists, update with any new info
      console.log('Candidate already exists:', candidate);
      candidate.name = extractedInfo.name || candidate.name;
      candidate.phone = extractedInfo.phone || candidate.phone;
      await candidate.save();
    } else {
      // If no candidate exists, create a new one with whatever we found
      candidate = new Candidate({
        name: extractedInfo.name,
        email: extractedInfo.email,
        phone: extractedInfo.phone,
      });
      await candidate.save();
      console.log('New candidate created with partial info:', candidate);
    }
    // --- END OF CORRECTION ---

    // Always return a success response with the candidate object
    res.status(201).json(candidate);

  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ message: 'Server error processing file.' });
  }
});


app.patch('/api/candidates/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // Update fields that are present in the request body
    if (req.body.name) candidate.name = req.body.name;
    if (req.body.phone) candidate.phone = req.body.phone;

    const updatedCandidate = await candidate.save();
    console.log("Candidate updated:", updatedCandidate);
    res.json(updatedCandidate);

  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ message: 'Server error updating candidate.' });
  }
});


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});