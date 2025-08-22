import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface UserCardProps {
  user: {
    _id: string;
    username: string;
    online?: boolean;
    lastSeen?: string;
  };
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  const isOnline = user.online;

  const getStatusText = () => {
    if (isOnline) return 'Online';
    if (user.lastSeen) return `Last seen ${new Date(user.lastSeen).toLocaleTimeString()}`;
    return 'Offline';
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.status}>{getStatusText()}</Text>
        </View>
        <View style={[styles.statusIndicator, isOnline ? styles.online : styles.offline]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  status: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  online: {
    backgroundColor: 'green',
  },
  offline: {
    backgroundColor: 'gray',
  },
});

export default UserCard;
