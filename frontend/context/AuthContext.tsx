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
    // Check authentication status on component mount
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");
        
        if (userData && token) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // Clear invalid data
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
    console.log("AuthContext login called with:", responseData);
    
    // ✅ FIXED: Extract data from responseData.data
    const { accessToken, refreshToken, user } = responseData.data;
    
    if (typeof window !== "undefined") {
      // Store in localStorage for client-side access
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ ALSO STORE IN COOKIES for middleware access
      document.cookie = `accessToken=${accessToken}; path=/; max-age=2592000`; // 30 days
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000`;
    }

    setUser(user);

    console.log("Login successful, redirecting to dashboard...");
    
    // Redirect to dashboard
    router.push("/dashboard");
    router.refresh();
    
  } catch (error) {
    console.error("Error during login:", error);
  }
};

  const logout = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Also clear cookies
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    setUser(null);
    router.push("/login");
    router.refresh();
  } catch (error) {
    console.error("Error during logout:", error);
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