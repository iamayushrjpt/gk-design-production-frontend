import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setToken, clearToken, USE_LIVE_API, ApiError } from "../lib/api";

type AdminUser = { email: string; name: string; role: string };

type AuthContextValue = {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "gk_admin_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Demo mode (no VITE_API_BASE_URL configured): there's no backend to
    // authenticate against, so any non-empty email/password logs in as a
    // demo admin. This keeps the admin panel reachable for evaluating the
    // UI standalone — the moment VITE_API_BASE_URL is set, this branch is
    // skipped and real credentials against the Spring Boot backend are required.
    if (!USE_LIVE_API) {
      if (!email.trim() || !password.trim()) {
        throw new ApiError("Enter an email and password.", 400);
      }
      const nextUser = { email, name: "Demo Admin", role: "SUPERADMIN" };
      sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      return;
    }

    const result = await api.auth.login(email, password);
    setToken(result.token);
    const nextUser = { email: result.email, name: result.name, role: result.role };
    sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    clearToken();
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiError };
