import express from 'express';

import authRoutes from './auth.route.js';
import ConversationRoutes from './conversation.route.js';
import messageRoutes from './message.route.js';
import userRouters from './user.route.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRouters);
router.use('/conversation', ConversationRoutes);
router.use('/message', messageRoutes);

export default router;
