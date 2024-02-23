import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  create_open_conversation,
  getConversation,
  createGroup,
} from '../controllers/conversation.controller.js';

const router = express.Router();

router.route('/').post(authMiddleware, create_open_conversation);
router.route('/').get(authMiddleware, getConversation);
router.route('/group').post(authMiddleware, createGroup);

export default router;
