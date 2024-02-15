import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { searchUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/register').get(authMiddleware, searchUsers);

export default router;
