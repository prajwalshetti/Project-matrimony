// src/context/AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userid, setUserid] = useState(null);
  const [name, setName] = useState(null);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        userid,
        name,
        isProfileCompleted,
        setUserid,
        setName,
        setIsProfileCompleted
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
}