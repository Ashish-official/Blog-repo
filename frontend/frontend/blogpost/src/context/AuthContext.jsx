import { useState } from "react";
import { AuthContext } from "./AuthContext.js";

export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(() => {
    return storedUser && storedToken ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => storedToken || null);
  const loading = false;

  const login = ({ user: userData, token: authToken }) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
