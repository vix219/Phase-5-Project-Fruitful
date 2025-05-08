// Import necessary hooks and utilities from React
import React, { createContext, useState, useContext } from 'react';

// Create a new context for user data, initially undefined
const UserContext = createContext();

// Provider component that wraps parts of the app needing access to user state
export const UserProvider = ({ children }) => {
  // Shared state: stores the current user object (null by default)
  const [user, setUser] = useState(null);

  return (
    // Make `user` and `setUser` accessible to any component wrapped inside this provider
    <UserContext.Provider value={{ user, setUser }}>
      {children} {/* Render any nested components inside the provider */}
    </UserContext.Provider>
  );
};

// Custom hook to easily access the UserContext in any functional component
export const useUser = () => useContext(UserContext);
