import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import candidateRoutes from './routes/candidateRoutes.js';
import { generateQuestion } from './lib/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

app.post('/api/interview/start', async (req, res) => {
  // Note: This might also become a protected route later
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