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
      console.log("🔍 [AuthContext] Login function called");

      const { accessToken, refreshToken, user } = responseData.data;

      console.log(
        "🔍 [AuthContext] Extracted accessToken length:",
        accessToken?.length
      );

      if (typeof window !== "undefined") {
        // Store in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Store in cookies
        const cookieOptions = `path=/; max-age=2592000; SameSite=Lax`;
        document.cookie = `accessToken=${accessToken}; ${cookieOptions}`;
        document.cookie = `refreshToken=${refreshToken}; ${cookieOptions}`;

        console.log("🔍 [AuthContext] Cookies after setting:", document.cookie);
      }

      setUser(user);

      console.log("🔍 [AuthContext] Login successful, redirecting...");

      // Use window.location for guaranteed redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    } catch (error) {
      console.error("❌ [AuthContext] Error during login:", error);
    }
  };
  const logout = () => {
    try {
      console.log("🔍 [AuthContext] Logout function called");

      if (typeof window !== "undefined") {
        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Clear cookies
        document.cookie =
          "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie =
          "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        console.log(
          "🔍 [AuthContext] After logout - localStorage user:",
          localStorage.getItem("user")
        );
        console.log(
          "🔍 [AuthContext] After logout - cookies:",
          document.cookie
        );
      }

      // Clear state
      setUser(null);

      console.log("🔍 [AuthContext] Redirecting to login...");

      // Use window.location for guaranteed redirect
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    } catch (error) {
      console.error("❌ [AuthContext] Error during logout:", error);
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
