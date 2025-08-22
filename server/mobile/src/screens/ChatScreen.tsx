import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from 'react-native';

import ChatBubble from '../components/ChatBubble';
import InputBox from '../components/InputBox';
import TypingIndicator from '../components/TypingIndicator';
import { useSocket } from '../context/SocketContext';
import { getMessages, createConversation } from '../api/chatApi';
import { useAuth } from '../context/AuthContext';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Chat: { userId: string; username: string };
};

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  read: boolean;
  createdAt: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  tempId?: string;
}

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen = ({ route }: ChatScreenProps) => {
  const { userId: recipientId, username } = route.params;
  const { user } = useAuth();
  const { socket, typingUsers } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const isRecipientTyping = typingUsers.has(recipientId);

  // ---- Initialize Chat ----
  useEffect(() => {
    const initChat = async () => {
      if (!user?.userId || !user.token) return;

      try {
        setLoading(true);

        const conversation = await createConversation(recipientId, user.token);
        setConversationId(conversation._id);

        const msgs = await getMessages(conversation._id, user.token);
        setMessages(
          msgs
            .map((msg: Message) => ({
              ...msg,
              status: msg.read ? 'read' : 'delivered',
            }))
            .reverse()
        );
      } catch (err: any) {
        console.error('Chat init error:', err);
        Alert.alert('Error', err.message || 'Failed to start chat.');
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [recipientId, user?.userId, user?.token]);

  // ---- Socket Event Handling ----
  useEffect(() => {
    if (!socket || !conversationId || !user?.userId) return;

    socket.emit('joinConversation', conversationId);

    const handleNewMessage = (message: Message & { tempId?: string }) => {
      if (message.conversationId !== conversationId) return;

      // Update own message from 'sending' → 'sent'
      if (message.senderId === user.userId && message.tempId) {
        setMessages(prev =>
          prev.map(m => (m._id === message.tempId ? { ...message, status: 'sent' } : m))
        );
      } else if (message.senderId !== user.userId) {
        // Incoming message
        setMessages(prev => [{ ...message, status: 'delivered' }, ...prev]);
        socket.emit('messagesRead', { messageIds: [message._id], conversationId, readerId: user.userId });
      }
    };

    const handleMessageDelivered = (data: { messageId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setMessages(prev =>
          prev.map(msg => (msg._id === data.messageId ? { ...msg, status: 'delivered' } : msg))
        );
      }
    };

    const handleMessagesRead = (data: { messageIds: string[]; conversationId: string; readerId: string }) => {
      if (data.conversationId === conversationId) {
        setMessages(prev =>
          prev.map(msg => (data.messageIds.includes(msg._id) ? { ...msg, status: 'read' } : msg))
        );
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageDelivered', handleMessageDelivered);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageDelivered', handleMessageDelivered);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, conversationId, user?.userId]);

  // ---- Send Message ----
  const handleSend = useCallback(
    (text: string) => {
      if (!conversationId || !socket || !user?.userId || !text.trim()) return;

      const tempId = `temp_${Date.now()}`;
      const newMessage: Message = {
        _id: tempId,
        tempId,
        conversationId,
        senderId: user.userId,
        text: text.trim(),
        createdAt: new Date().toISOString(),
        read: false,
        status: 'sending',
      };

      setMessages(prev => [newMessage, ...prev]);

      socket.emit('sendMessage', {
        conversationId,
        senderId: user.userId,
        text: text.trim(),
        tempId,
      });
    },
    [conversationId, socket, user?.userId]
  );

  // ---- Typing ----
  const handleTyping = useCallback(() => {
    if (!socket || !conversationId) return;

    socket.emit('typingStart', { conversationId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typingStop', { conversationId });
      typingTimeoutRef.current = null;
    }, 2000) as unknown as number;
  }, [socket, conversationId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <ChatBubble
            text={item.text}
            isMe={item.senderId === user?.userId}
            status={item.status}
            timestamp={item.createdAt}
          />
        )}
        inverted
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      <TypingIndicator isVisible={isRecipientTyping} username={username} />

      <InputBox onSend={handleSend} onTyping={handleTyping} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messagesContainer: { padding: 16 },
});

export default ChatScreen;
