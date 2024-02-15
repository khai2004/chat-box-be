import createHttpError from 'http-errors';
import {
  createConversation,
  doesConversationExist,
  getUserConversations,
  populateConversation,
} from '../services/conversation.service.js';
import { findUser } from '../services/user.service.js';

export const create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { receiver_id } = req.body;

    //check if reciever_id is provided
    if (!receiver_id) {
      logger.error(
        'Please provide the user id you want to start a conversation with !'
      );
      throw createHttpError.BadGateway('Something went wrong !');
    }

    //check if chat exists
    const existed_conversation = await doesConversationExist(
      sender_id,
      receiver_id
    );

    if (existed_conversation) {
      res.json(existed_conversation);
    } else {
      let receiver_user = await findUser(receiver_id);
      let conversationData = {
        name: receiver_user.name,
        picture: receiver_user.picture,
        isGroup: false,
        users: [sender_id, receiver_id],
      };
      const newConversation = await createConversation(conversationData);
      const populateConver = await populateConversation(
        newConversation._id,
        'users',
        '-password'
      );

      res.status(200).json(populateConver);
    }
  } catch (error) {
    console.log('test');
    next(error);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const user_id = req.user.userId;
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};
