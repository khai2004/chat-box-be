import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const ConversationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Convesation is required.'],
      trim: true,
    },
    picture: {
      type: String,
      required: true,
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    users: [
      {
        type: ObjectId,
        ref: 'UserModel',
      },
    ],
    latestMessage: {
      type: ObjectId,
      ref: 'MessageModel',
    },
    admin: {
      type: ObjectId,
      ref: 'UserModel',
    },
  },
  {
    collection: 'conversations',
    timestamps: true,
  }
);

const ConversationModel =
  mongoose.models.ConversationModel ||
  mongoose.model('ConversationModel', ConversationSchema);

export default ConversationModel;
