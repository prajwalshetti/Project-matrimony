// src/context/AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Simple state initialization without localStorage
  const [userid, setUserid] = useState(null);
  const [name, setName] = useState(null);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);

  // Clear function for logout
  const clearAuth = () => {
    setUserid(null);
    setName(null);
    setIsProfileCompleted(false);
  };

  return (
    <AuthContext.Provider
      value={{
        userid,
        name,
        isProfileCompleted,
        setUserid,
        setName,
        setIsProfileCompleted,
        clearAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;