import {Schema, Document, models, model} from 'mongoose';
import { Chat, Message, MessagePart, User } from './types';

export interface UserDocument extends Omit<User, 'id'>, Document {}

const UserSchema = new Schema<UserDocument>({
   email: {
      type: String,
      required: true
   },
   name: {
      type: String
   },
   chats: {
      type: [String],
      default: []
   }
})

const JobSchema = new Schema({
   id: {
      type: String,
      required: true,
      unique: true
   },
   status: {
      type: String,
      enum: ["queued", "generating_video", "uploading_video", "completed", "failed"],
      default: "queued"
   },
   videoUrl: {
      type: String,
      default: null
   }
})

export interface MessagePartDocument extends MessagePart, Document {}

const MessagePartSchema = new Schema<MessagePart>({
   type: String,
   text: String
})

export interface MessageDocument extends Omit<Message, 'id'>, Document {}

const MessageSchema = new Schema<MessageDocument>({
   id: {
      type: String,
      required: true
   },
   chatId: {
      type: String,
      required: true
   },
   role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
   },
   content: {
      type: String,
      required: true
   },
   parts: {
      type: [MessagePartSchema],
      default: []
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});


export interface ChatDocument extends Chat, Omit<Document, 'id'> {}

const ChatSchema = new Schema<ChatDocument>({
   id: {
      type: String,
      required: true,
      unique: true
   },
   userId: {
      type: String,
      required: true
   },
   title: {
      type: String,
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   },
   updatedAt: {
      type: Date,
      default: Date.now
   }
}, {id: false});



export const UserModel = models.User || model<UserDocument>('User', UserSchema);
export const ChatModel = models.Chat || model<ChatDocument>('Chat', ChatSchema);
export const MessageModel = models.Message || model<MessageDocument>('Message', MessageSchema);
export const JobModel = models.Jobs || model('Jobs', JobSchema);