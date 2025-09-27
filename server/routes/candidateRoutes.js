import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { uploadResume, getMyInterviews } from '../controllers/candidateController.js'; // We will create this controller next

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
  .post(protect, upload.single('resume'), uploadResume);

router.route('/my-interviews')
  .get(protect, getMyInterviews);

export default router;