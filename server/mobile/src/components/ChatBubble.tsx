import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ChatBubbleProps {
  text: string;
  isMe: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  timestamp: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isMe, status, timestamp }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Icon name="access-time" size={12} color="#999" />;
      case 'sent':
        return <Icon name="check" size={12} color="#999" />;
      case 'delivered':
        return <Icon name="done-all" size={12} color="#999" />;
      case 'read':
        return <Icon name="done-all" size={12} color="#007AFF" />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, isMe ? styles.meContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isMe ? styles.me : styles.other]}>
        <Text style={isMe ? styles.textMe : styles.textOther}>{text}</Text>
      </View>
      <View style={[styles.footer, isMe ? styles.meFooter : styles.otherFooter]}>
        <Text style={styles.timestamp}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {isMe && getStatusIcon()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  meContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 4,
  },
  me: {
    backgroundColor: '#007AFF',
  },
  other: {
    backgroundColor: '#E5E5EA',
  },
  textMe: {
    color: 'white',
    fontSize: 16,
  },
  textOther: {
    color: 'black',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  meFooter: {
    justifyContent: 'flex-end',
  },
  otherFooter: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginRight: 4,
  },
});

export default ChatBubble;