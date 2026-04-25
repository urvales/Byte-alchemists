import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const TOKEN_KEY = 'roamwise_token';
const USER_KEY = 'roamwise_user';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    setIsLoaded(true);
  }, []);

  const login = (t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('roamwise_onboarding');
    setToken(null);
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, token, isLoaded, isSignedIn: !!token, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
