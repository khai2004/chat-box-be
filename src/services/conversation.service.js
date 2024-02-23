import createHttpError from 'http-errors';
import ConversationModel from '../models/ConversationModel.js';
import UserModel from '../models/userModel.js';

export const doesConversationExist = async (
  sender_id,
  receiver_id,
  isGroup
) => {
  if (!isGroup) {
    let conversation = await ConversationModel.find({
      isGroup: false,
      $and: [
        {
          users: { $elemMatch: { $eq: sender_id } },
        },
        {
          users: { $elemMatch: { $eq: receiver_id } },
        },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    if (!conversation) {
      throw createHttpError.BadRequest('Opps...Something went wrong !');
    }

    //populate message model
    conversation = await UserModel.populate(conversation, {
      path: 'latestMessage.sender',
      select: 'name email picture status',
    });

    return conversation[0];
  } else {
    // it is a group chat
    let conversation = await ConversationModel.findById(isGroup)
      .populate('users admin', '-password')
      .populate('latestMessage');

    if (!conversation) {
      throw createHttpError.BadRequest('Opps...Something went wrong !');
    }

    //populate message model
    conversation = await UserModel.populate(conversation, {
      path: 'latestMessage.sender',
      select: 'name email picture status',
    });

    return conversation;
  }
};

export const createConversation = async (data) => {
  const newConversation = await ConversationModel.create(data);
  if (!newConversation) {
    throw createHttpError.BadRequest('Oops...Something went wrong !');
  }
  return newConversation;
};

export const populateConversation = async (
  id,
  fieldToPopulate,
  fieldsToRemove
) => {
  const populateConver = await ConversationModel.findOne({ _id: id }).populate(
    fieldToPopulate,
    fieldsToRemove
  );

  if (!populateConver) {
    throw createHttpError.BadRequest('Oops...Something went wrong !');
  }
  return populateConver;
};

export const getUserConversations = async (user_id) => {
  let conversation;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate('users', '-password')
    .populate('admin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: 'latestMessage.sender',
        select: 'name email picture status',
      });
      conversation = results;
    })
    .catch((err) => {
      throw createHttpError.BadRequest('Oops...Something went wrong !');
    });
  return conversation;
};

export const updateLatestMessage = async (conve_id, msg) => {
  const updateConve = await ConversationModel.findByIdAndUpdate(conve_id, {
    latestMessage: msg,
  });
  if (!updateConve) {
    throw createHttpError.BadRequest('Oop...Something went wrong !');
  }
};
