"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../lib/api/api";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
 

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // 🔁 Load user & token on refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("userToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setUserToken(storedToken);
      }
    } catch (err) {
      localStorage.removeItem("user");
      localStorage.removeItem("userToken");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ LOGIN
  const login = async (credentials) => {
    try {
      setLoading(true);

      const res = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      setUser(data.user);
      setUserToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userToken", data.token);

      return data;
    } finally {
      setLoading(false);
    }
  };

  // ✅ REGISTER (NO auto-login)
  const register = async (payload) => {
    try {
      setLoading(true);

      const res = await fetch(API.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "User already exists");
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

// ✅ LOGOUT
const logout = async () => {
  try {
    setLoading(true);

    await fetch(API.logout, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  } catch (err) {
    console.warn("Logout API failed, clearing local session");
  } finally {
    setUser(null);
    setUserToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    setLoading(false);
  }
};


  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
