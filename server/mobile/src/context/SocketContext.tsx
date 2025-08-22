import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: Set<string>;
  typingUsers: Map<string, boolean>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: new Set(),
  typingUsers: new Map(),
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Map<string, boolean>>(new Map());
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.userId) return;

    const newSocket = io('http://10.249.211.64:5000'); // replace with your backend
    setSocket(newSocket);

    // Tell server who we are
    newSocket.emit('register', user.userId);

    // Receive full online users list
    newSocket.on('onlineUsers', (users: string[]) => {
      setOnlineUsers(new Set(users));
    });

    // Typing events
    newSocket.on('userTyping', ({ userId, typing }: { userId: string; typing: boolean }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        if (typing) newMap.set(userId, true);
        else newMap.delete(userId);
        return newMap;
      });
    });

    // Message status events (optional for logs)
    newSocket.on('messageDelivered', (data: any) => console.log('Message delivered:', data));
    newSocket.on('messagesRead', (data: any) => console.log('Messages read:', data));

    return () => {
      newSocket.disconnect();
    };
  }, [user?.userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, typingUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
