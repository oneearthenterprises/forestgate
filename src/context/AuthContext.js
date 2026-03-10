"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { API } from "../lib/api/api";

const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
const [adminToken, setAdminToken] = useState(null);
const [adminEmail, setAdminEmail] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("userToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setUserToken(storedToken);
      }

      const storedAdminToken = localStorage.getItem("adminToken");

if (storedAdminToken) {
  setAdminToken(storedAdminToken);
}
    } catch (err) {
      localStorage.removeItem("user");
      localStorage.removeItem("userToken");
    } finally {
      setLoading(false);
    }
  }, []);

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
    document.cookie = `user-auth=${data.token}; path=/; max-age=86400; samesite=lax`;

      return data;
    } finally {
      setLoading(false);
    }
  };

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
      setAdminToken(null);
localStorage.removeItem("adminToken");
document.cookie = "admin-auth=; path=/; max-age=0;";
document.cookie = "user-auth=; path=/; max-age=0;";
    }
  };

const adminlogin = async (credentials) => {
  try {
    setLoading(true);

    const res = await fetch(API.adminApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Admin login failed");
    }

    setAdminToken(data.token);
    setAdminEmail(credentials.email);

    document.cookie = `admin-auth=${data.token}; path=/; max-age=86400; samesite=lax`;

    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("adminEmail", credentials.email);


    return data;
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthContext.Provider
  value={{
    user,
    userToken,
    adminToken,
    loading,
    login,
    adminEmail,
    register,
    logout,
    adminlogin,
  }}
>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
