import { createContext, useContext } from "react";

// 1. Create Context
export const AuthContext = createContext(null);

// 2. Export Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};