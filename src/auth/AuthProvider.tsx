import React, { createContext, useContext, useEffect, useState } from "react";
import { login as doLogin, logout as doLogout, getMe, User } from "./auth";
import { setAccessToken, setRefreshToken } from "../api/api";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rt = localStorage.getItem("refresh_token");

  if (!rt) {
    setLoading(false);
    return;
  }

    (async () => {
      try {
        const u = await getMe();
        setUser(u);
      } catch {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const u = await doLogin(email, password);
      setUser(u);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await doLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("Missing AuthProvider");
  return v;
}