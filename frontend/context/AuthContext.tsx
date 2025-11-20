"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (responseData: any) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore user on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // LOGIN (only store user, backend handles cookies)
  const login = (responseData: any) => {
    try {
      const { user } = responseData.data;

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // redirect
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // LOGOUT (call backend to clear cookies + clear frontend user)
  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.warn("Logout request failed — clearing session anyway.");
    }

    localStorage.removeItem("user");
    setUser(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
