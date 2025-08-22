export interface User {
  _id: string;
  username: string;
  email: string;
  online: boolean;
  lastSeen?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  read: boolean;
  createdAt: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface TypingUser {
  userId: string;
  typing: boolean;
}

export interface Conversation {
  _id: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}