import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("guest");

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") || "guest";
    setUserRole(savedRole);
  }, []);

  const loginAsAdmin = () => {
    setUserRole("admin");
    localStorage.setItem("userRole", "admin");
  };

  const logout = () => {
    setUserRole("guest");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
  };

  return (
    <AuthContext.Provider value={{ userRole, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
