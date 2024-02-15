import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.route('/').post(authMiddleware, sendMessage);
router.route('/:conve_id').get(authMiddleware, getMessages);
export default router;
