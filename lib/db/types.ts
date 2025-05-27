
export interface MessagePart {
   type?: string;
   text?: string;
}

export interface Message {
   id: string;
   chatId: string;
   role: 'user' | 'assistant';
   content: string;
   parts?: MessagePart[];
   createdAt?: Date;
}

export interface Chat {
   id: string;
   userId: string;
   title: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface User {
   id: string;
   email: string;
   name?: string;
   chats: string[]
}


export interface Job {
   id: string;
   status: string;
   videoUrl: string | null;
}