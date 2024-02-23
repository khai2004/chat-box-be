import logger from '../configs/logger.config.js';
import { updateLatestMessage } from '../services/conversation.service.js';
import {
  createMessage,
  getConveMessages,
  populateMessage,
} from '../services/message.service.js';

export const sendMessage = async (req, res, next) => {
  try {
    const user_id = req.user.userId;

    const { message, conve_id, files } = req.body;
    if (!conve_id || (!message && !files)) {
      logger.error('Please provider a conversation id and a message body');
      return res.sendStatus(400);
    }
    const msgData = {
      sender: user_id,
      message,
      conversation: conve_id,
      files: files || [],
    };

    let newMessage = await createMessage(msgData);
    let populatedMessage = await populateMessage(newMessage);

    await updateLatestMessage(conve_id, newMessage._id);
    res.json(populatedMessage);
  } catch (error) {
    next(error);
  }
};
export const getMessages = async (req, res, next) => {
  console.log(req.params.conve_id);
  try {
    const conve_id = req.params.conve_id;
    if (!conve_id) {
      logger.error('Please add a conversation id in params.');
      res.sendStatus(400);
    }

    const messages = await getConveMessages(conve_id);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
