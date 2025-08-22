import axios from 'axios';

const API_URL = 'http://10.249.211.64:5000/auth';

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    return response.data; // Should return { token, userId }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Should return { token, userId }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};