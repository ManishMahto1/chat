import AsyncStorage from '@react-native-async-storage/async-storage';

// Token storage
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

// User ID storage
export const storeUserId = async (userId: string) => {
  try {
    await AsyncStorage.setItem('userId', userId);
  } catch (error) {
    console.error('Failed to store userId:', error);
  }
};

export const getUserId = async () => {
  try {
    return await AsyncStorage.getItem('userId');
  } catch (error) {
    console.error('Failed to get userId:', error);
    return null;
  }
};

export const removeUserId = async () => {
  try {
    await AsyncStorage.removeItem('userId');
  } catch (error) {
    console.error('Failed to remove userId:', error);
  }
};

// User data storage
export const storeUserData = async (userData: any) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Failed to store user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return null;
  }
};