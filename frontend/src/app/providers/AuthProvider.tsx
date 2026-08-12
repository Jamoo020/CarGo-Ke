import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError, AuthState, User } from "../../types/auth";
import { clearToken, getStoredToken, storeToken } from "../../lib/storage";
import { getCurrentUser, login as loginRequest, logout as logoutRequest } from "../../lib/auth";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      setUser(response.data);
      setToken(currentToken);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.status === "401") {
        clearToken();
        setToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginRequest({ email, password });
      const nextToken = response.data.token;
      setToken(nextToken);
      storeToken(nextToken);

      const currentUser = response.data.user;
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [login, logout, refreshUser, token, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
