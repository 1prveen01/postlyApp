"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

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
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");

        if (userData && token) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (responseData: any) => {
    try {
      console.log("🔍 [AuthContext] Login function called");

      const { accessToken, refreshToken, user } = responseData.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        const cookieOptions = `path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `accessToken=${accessToken}; ${cookieOptions}`;
        document.cookie = `refreshToken=${refreshToken}; ${cookieOptions}`;
      }

      setUser(user);

      console.log("🔍 [AuthContext] Login successful, redirecting...");

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("❌ [AuthContext] Error during login:", error);
    }
  };

  const logout = () => {
    try {
      console.log("🔍 [AuthContext] Logout function called");

      // Clear React state FIRST
      setUser(null);

      if (typeof window !== "undefined") {
        // Clear all storage
        localStorage.clear();
        
        // Clear all cookies completely
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      }

      console.log("🔍 [AuthContext] Redirecting to login...");

      // Force full page reload to reset everything
      window.location.href = "/login";
      window.location.reload();

    } catch (error) {
      console.error("❌ [AuthContext] Error during logout:", error);
      window.location.href = "/login";
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};