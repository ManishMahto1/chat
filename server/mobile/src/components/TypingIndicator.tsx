import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TypingIndicatorProps {
  isVisible: boolean;
  username: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible, username }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{username} is typing...</Text>
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 12,
  },
  text: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    marginHorizontal: 1,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 0.8,
  },
});

export default TypingIndicator;