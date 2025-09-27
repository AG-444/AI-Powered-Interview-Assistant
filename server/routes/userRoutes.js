import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.route('/profile').put(protect, updateUserProfile);

export default router;