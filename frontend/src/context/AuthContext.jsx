// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [userid, setUserid] = useState(() => {
    const saved = localStorage.getItem('appContext');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.userid || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [name, setName] = useState(() => {
    const saved = localStorage.getItem('appContext');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.name || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isProfileCompleted, setIsProfileCompleted] = useState(() => {
    const saved = localStorage.getItem('appContext');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.isProfileCompleted || false;
      } catch {
        return false;
      }
    }
    return false;
  });

  // Sync state to localStorage whenever any value changes
  useEffect(() => {
    const contextData = {
      userid,
      name,
      isProfileCompleted
    };
    localStorage.setItem('appContext', JSON.stringify(contextData));
  }, [userid, name, isProfileCompleted]);

  // Clear function for logout
  const clearAuth = () => {
    setUserid(null);
    setName(null);
    setIsProfileCompleted(false);
    localStorage.removeItem('appContext');
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