import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  getToken, storeToken, removeToken, 
  getUserId, storeUserId, removeUserId 
} from '../utils/storage';

interface User {
  token: string;
  userId: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const token = await getToken();
        const userId = await getUserId();

        if (token && userId) {
          setUser({ token, userId });
        }
      } catch (error) {
        console.error('Failed to load stored data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const handleSetUser = async (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      if (newUser.token) await storeToken(newUser.token);
      if (newUser.userId) await storeUserId(newUser.userId);
    } else {
      await removeToken();
      await removeUserId(); // ✅ clear userId too
    }
  };

  const logout = async () => {
    setUser(null);
    await removeToken();
    await removeUserId(); // ✅ clear userId on logout
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
