import axios from 'axios';

const API_URL = 'http://10.249.211.64:5000/api';

export const getUsers = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch users');
  }
};

export const getMessages = async (conversationId: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch messages');
  }
};

export const createConversation = async (participantId: string, token: string) => {
  try {
    console.log('Creating conversation with:', participantId);
    const response = await axios.post(`${API_URL}/conversations`, 
      { participantId },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );
    
    console.log('Conversation creation successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create conversation API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    throw new Error(error.response?.data?.error || 'Failed to create conversation');
  }
};


/* 
export const createConversation = async (participantId: string, token: string) => {
  try {
    console.log('Creating conversation with:', participantId);
    const response = await axios.post(`${API_URL}/conversations`, 
      { participantId },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );
    
    console.log('Conversation creation successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Create conversation API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    throw new Error(error.response?.data?.error || 'Failed to create conversation');
  }
}; */


export const sendMessage = async (conversationId: string, text: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/messages/send`,
      { conversationId, text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to send message');
  }
};

export const getConversations = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch conversations');
  }
};