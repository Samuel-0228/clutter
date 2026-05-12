import { Session, User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { AuthActionResult, DemoUser } from "@/types/auth";

import { isSupabaseConfigured, supabase } from "@/services/supabase";
import { readItem, saveItem } from "@/services/storage";

const DEMO_SESSION_KEY = "taskapp:demo-session";
const DEMO_USER: DemoUser = {
  id: "demo-user",
  email: "demo@taskapp.local",
};

type AuthContextValue = {
  initialized: boolean;
  authLoading: boolean;
  session: Session | null;
  user: User | DemoUser | null;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (email: string, password: string) => Promise<AuthActionResult>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | DemoUser | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let active = true;

    async function initialize() {
      if (isSupabaseConfigured && supabase) {
        const [{ data }, { data: listener }] = await Promise.all([
          supabase.auth.getSession(),
          Promise.resolve(
            supabase.auth.onAuthStateChange((_event, nextSession) => {
              setSession(nextSession);
              setUser(nextSession?.user ?? null);
              setIsDemoMode(false);
            }),
          ),
        ]);

        if (active) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          setIsDemoMode(false);
          setInitialized(true);
        }

        return () => {
          listener.subscription.unsubscribe();
        };
      }

      const demoActive = await readItem<boolean>(DEMO_SESSION_KEY, false);
      if (!active) return;

      if (demoActive) {
        setSession({ user: DEMO_USER } as Session);
        setUser(DEMO_USER);
        setIsDemoMode(true);
      }

      setInitialized(true);
      return undefined;
    }

    let cleanup: (() => void) | undefined;
    initialize().then((result) => {
      cleanup = result;
    });

    return () => {
      active = false;
      cleanup?.();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<AuthActionResult> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message: "Supabase keys are missing. Use demo mode or add EXPO_PUBLIC_SUPABASE_* values.",
      };
    }

    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);

    return {
      success: !error,
      message: error?.message ?? "Signed in successfully.",
    };
  }

  async function signUp(email: string, password: string): Promise<AuthActionResult> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message: "Supabase keys are missing. Use demo mode or add EXPO_PUBLIC_SUPABASE_* values.",
      };
    }

    setAuthLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setAuthLoading(false);

    if (!error) {
      setSession(data.session ?? ({ user: data.user } as Session));
      setUser(data.user);
      setIsDemoMode(false);
    }

    return {
      success: !error,
      message: error?.message ?? "Account created successfully.",
    };
  }

  async function signInDemo() {
    setSession({ user: DEMO_USER } as Session);
    setUser(DEMO_USER);
    setIsDemoMode(true);
    await saveItem(DEMO_SESSION_KEY, true);
  }

  async function signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }

    await saveItem(DEMO_SESSION_KEY, false);
    setSession(null);
    setUser(null);
    setIsDemoMode(false);
  }

  const value = useMemo(
    () => ({
      initialized,
      authLoading,
      session,
      user,
      isDemoMode,
      signIn,
      signUp,
      signInDemo,
      signOut,
    }),
    [authLoading, initialized, isDemoMode, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
