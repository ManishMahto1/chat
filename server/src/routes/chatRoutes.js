import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { getUsers, getMessages, createConversation,sendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.use(authenticate);
router.get('/users', getUsers);
router.get('/conversations/:id/messages', getMessages); // id = conversationId
router.post('/conversations', createConversation);
router.post("/messages/send", sendMessage);
export default router;