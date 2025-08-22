import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputBoxProps {
  onSend: (text: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend, onTyping }) => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
      Keyboard.dismiss();
      handleTypingChange(false);
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    
    if (newText.length > 0 && !isTyping) {
      handleTypingChange(true);
    } else if (newText.length === 0 && isTyping) {
      handleTypingChange(false);
    }
  };

  const handleTypingChange = (typing: boolean) => {
    setIsTyping(typing);
    onTyping?.(typing);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (typing) {
      typingTimeoutRef.current = setTimeout(() => {
        handleTypingChange(false);
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleTextChange}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <Icon name="send" size={24} color={text.trim() ? "#007AFF" : "#ccc"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    padding: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default InputBox;