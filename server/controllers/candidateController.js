import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import { extractNameFromResume } from '../lib/ai.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

export const uploadResume = async (req, res) => {
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
    }
    
    // --- CORRECTED HYBRID EXTRACTION LOGIC ---
    // 1. Use Regex for Email and Phone first
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    const emailMatch = text.match(emailRegex);
    const phoneMatch = text.match(phoneRegex);

    // 2. Initialize extractedInfo as an OBJECT
    const extractedInfo = {
      email: emailMatch ? emailMatch[0] : (req.user.email || null),
      phone: phoneMatch ? phoneMatch[0] : null,
    };
    
    // 3. Use AI for the Name and add it to the object
    extractedInfo.name = await extractNameFromResume(text);
    // --- END OF CORRECTION ---

    // Update the main User profile with extracted info if it's missing
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = user.name || extractedInfo.name;
      user.phone = user.phone || extractedInfo.phone;
      await user.save();
    }

    // Create a new Candidate record for this specific interview attempt
    const candidate = await Candidate.create({
      user: req.user._id,
      name: extractedInfo.name || user.name,
      email: extractedInfo.email,
      phone: extractedInfo.phone || user.phone,
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ message: 'Server error processing file.' });
  }
};

export const getMyInterviews = async (req, res) => {
    try {
        const interviews = await Candidate.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};