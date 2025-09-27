import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
  },
  email: {
    type: String,
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

// Creates a unique index only for documents that have an email value
CandidateSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $ne: null } }
  }
);

const Candidate = mongoose.model('Candidate', CandidateSchema);

export default Candidate;