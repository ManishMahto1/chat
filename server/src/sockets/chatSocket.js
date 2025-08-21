import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// Map to track online users: userId -> socket.id
const onlineUsers = new Map();

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // ---- REGISTER USER ----
    socket.on('register', (userId) => {
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);

      // Broadcast updated online users list to all clients
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log('User registered online:', userId);
    });

    // ---- JOIN CONVERSATION ROOM ----
    socket.on('joinConversation', async (conversationId) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          socket.join(conversationId);
          console.log(`User ${socket.userId} joined conversation: ${conversationId}`);
        }
      } catch (err) {
        console.error('Join conversation error:', err);
      }
    });

    // ---- SEND MESSAGE ----
    socket.on('sendMessage', async ({ conversationId, senderId, text, tempId }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(senderId)) return;

        const message = new Message({ conversationId, senderId, text });
        await message.save();

        // Emit message to everyone in the room
        io.to(conversationId).emit('newMessage', { ...message.toObject(), tempId });

        // Optional: Emit messageDelivered to sender
        socket.emit('messageDelivered', { messageId: message._id, conversationId });
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    // ---- TYPING INDICATORS ----
    socket.on('typingStart', ({ conversationId }) => {
      socket.to(conversationId).emit('userTyping', { userId: socket.userId, typing: true });
    });

    socket.on('typingStop', ({ conversationId }) => {
      socket.to(conversationId).emit('userTyping', { userId: socket.userId, typing: false });
    });

    // ---- DISCONNECT ----
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
        console.log('User disconnected:', socket.userId);
      }
      console.log('Socket disconnected:', socket.id);
    });
  });
};
import mongoose from 'mongoose';