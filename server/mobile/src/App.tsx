import React from 'react';
import AppNavigator from '../src/navigation/AppNavigator';
import { AuthProvider } from '../src/context/AuthContext';
import { SocketProvider } from '../src/context/SocketContext';

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppNavigator />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;