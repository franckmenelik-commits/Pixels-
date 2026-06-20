"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

interface AuthContextType {
  firebaseUser: User | null;
  user: any | null;
  token: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ firebaseUser: null, user: null, token: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const t = await fbUser.getIdToken();
        setToken(t);
        const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } else {
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
