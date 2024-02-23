import createHttpError from 'http-errors';
import {
  createConversation,
  doesConversationExist,
  getUserConversations,
  populateConversation,
} from '../services/conversation.service.js';

export const create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user.userId;
    const { receiver_id, isGroup } = req.body;

    if (isGroup === false) {
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
        // let receiver_user = await findUser(receiver_id);
        let conversationData = {
          name: 'conversation name',
          picture: 'conversation picture',
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
    } else {
      //it is a group chat
      //check if chat exists
      const existed_conversation = await doesConversationExist('', '', isGroup);
      res.status(200).json(existed_conversation);
    }
  } catch (error) {
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

export const createGroup = async (req, res, next) => {
  const { name, users } = req.body;
  users.push(req.user.userId);
  console.log(users);
  if (!name || !users) {
    throw createHttpError.BadRequest('Please fill all field.');
  }

  if (users.length < 2) {
    throw createHttpError.BadRequest(
      'Atleast 2 users are required to start a group chat.'
    );
  }

  let converData = {
    name,
    users,
    isGroup: true,
    admin: req.user.userId,
    picture: process.env.DEFAULT_GROUP_IMAGE,
  };
  try {
    const newConver = await createConversation(converData);
    const populatedConver = await populateConversation(
      newConver._id,
      'users admin',
      '-password'
    );
    res.status(200).json(populatedConver);
  } catch (error) {
    next(error);
  }
};
