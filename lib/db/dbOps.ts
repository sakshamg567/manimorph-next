import { ChatModel, MessageModel, UserModel, JobModel } from "./models";
import { Chat, Message, User, Job } from "./types";
import dbConnect from "./util";
import { nanoid } from 'nanoid';

// ---------- user ops ------------
export async function findUserByEmail(email: string): Promise<User | null> {
   const user = await UserModel.findOne({ email });
   return user ? user.toObject() : null;
}

export async function createUser(userData: Partial<User>): Promise<User> {
   const user = await UserModel.create({
      email: userData.email,
      name: userData.name,
      chats: []
   })

   return user.toObject();
}

// -------- chat ops ---------
export async function createChat(userId: string, title: string, chatId: string): Promise<Chat> {
   await dbConnect();

   const chat = await ChatModel.create({
      id: chatId,
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
   })

   await UserModel.findOneAndUpdate(
      { email: userId },
      { $push: { chats: chatId } }
   );

   return chat.toObject();
}

export async function saveMessage(chatId: string, message: Partial<Message>): Promise<Message> {
   await dbConnect();

   const newMessage = await MessageModel.create({
      id: nanoid(),
      chatId: chatId,
      role: message.role,
      content: message.content,
      parts: message.parts || [],
      createdAt: message.createdAt || new Date()
   })

   if (chatId) {
      await ChatModel.findOneAndUpdate(
         { id: chatId },
         { updatedAt: new Date() }
      );
   }

   return newMessage.toObject();
}

export async function getChat(chatId: string): Promise<Chat | null> {
   await dbConnect();
   const chat = await ChatModel.findOne({ id: chatId });
   return chat ? chat.toObject() : null;
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
   await dbConnect();
   const messages = await MessageModel.find({ chatId }).sort({ createdAt: 1 });
   return messages.map(msg => msg.toObject());
}

export async function getUserChats(userId: string): Promise<Chat[]> {
   await dbConnect();
   const user = await UserModel.findOne({ email: userId });
   if (!user || !user.chats.length) return [];

   const chats = await ChatModel.find({ id: { $in: user.chats } }).sort({ updatedAt: -1 });
   return chats.map(chat => chat.toObject());
}


// ------------- Job ops -------------
export async function createJob(jobId: string): Promise<Job> {
   await dbConnect();

   const job = await JobModel.create({
      id: jobId,
      status: "queued",
      videoUrl: null,
   });

   return job.toObject();
}

export async function getJob(jobId: string): Promise<Job | null> {
   await dbConnect();

   const job = await JobModel.findOne({ id: jobId });
   return job ? job.toObject() : null;
}

export async function updateJobStatus(jobId: string, status: Job["status"]): Promise<Job | null> {
   await dbConnect();

   const job = await JobModel.findOneAndUpdate(
      { id: jobId },
      { status },
      { new: true } // return updated doc
   );

   return job ? job.toObject() : null;
}

export async function setJobVideoUrl(jobId: string, url: string): Promise<Job | null> {
   await dbConnect();

   const job = await JobModel.findOneAndUpdate(
      { id: jobId },
      { videoUrl: url },
      { new: true }
   );

   return job ? job.toObject() : null;
}

export async function getJobStatus(jobId: string): Promise<string> {
   const job = await getJob(jobId);
   return job?.status || 'idle';
}

export async function getJobVideoUrl(jobId: string): Promise<string | null> {
   const job = await getJob(jobId);
   return job?.videoUrl || null;
}
