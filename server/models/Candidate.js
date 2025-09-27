import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    // unique and sparse have been removed from here
  },
  phone: {
    type: String,
  },
  score: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Completed'],
    default: 'Pending',
  },
}, { timestamps: true });

// --- ADD THIS NEW INDEX DEFINITION ---
CandidateSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $ne: null } }
  }
);
// ------------------------------------

const Candidate = mongoose.model('Candidate', CandidateSchema);

export default Candidate;