// src/api/config.ts
import  API_URL  from "react-native-dotenv";

export const BASE_URL = API_URL || "http://10.249.211.64:5000";

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,

  // Chat
  GET_USERS: `${BASE_URL}/chat/users`,
  GET_MESSAGES: (conversationId: string) => `${BASE_URL}/chat/conversations/${conversationId}/messages`,
  CREATE_CONVERSATION: `${BASE_URL}/chat/conversations`,
};
