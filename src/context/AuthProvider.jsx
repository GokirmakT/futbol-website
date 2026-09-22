import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { logoutUser } from "../api/auth";
import { AuthContext } from "./AuthContext";

const SESSION_DURATION_MS = 60 * 60 * 1000;
const LAST_ACTIVITY_AT_KEY = "futbol_last_activity_at";

const mapUser = (authUser, profile) => {
  if (!authUser) {
    return null;
  }

  return {
    id: authUser.id,
    email: authUser.email,
    username:
      profile?.username ||
      authUser.user_metadata?.username ||
      authUser.email?.split("@")[0] ||
      "",
  };
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let sessionTimeout;
    let currentSession = null;

    const clearSessionTimeout = () => {
      if (sessionTimeout) {
        window.clearTimeout(sessionTimeout);
        sessionTimeout = undefined;
      }
    };

    const scheduleSessionExpiry = session => {
      clearSessionTimeout();

      if (!session) {
        window.localStorage.removeItem(LAST_ACTIVITY_AT_KEY);
        return true;
      }

      let lastActivityAt = Number(window.localStorage.getItem(LAST_ACTIVITY_AT_KEY));
      if (!lastActivityAt || Number.isNaN(lastActivityAt)) {
        lastActivityAt = Date.now();
        window.localStorage.setItem(LAST_ACTIVITY_AT_KEY, String(lastActivityAt));
      }

      const remainingTime = lastActivityAt + SESSION_DURATION_MS - Date.now();
      if (remainingTime <= 0) {
        logoutUser().catch(() => undefined);
        return false;
      }

      sessionTimeout = window.setTimeout(() => {
        logoutUser().catch(() => undefined);
      }, remainingTime);
      return true;
    };

    const recordActivity = () => {
      if (!isMounted || !currentSession) {
        return;
      }

      window.localStorage.setItem(LAST_ACTIVITY_AT_KEY, String(Date.now()));
      scheduleSessionExpiry(currentSession);
    };

    const syncUser = async authUser => {
      if (!authUser) {
        if (isMounted) {
          setUser(null);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", authUser.id)
        .maybeSingle();

      if (isMounted) {
        setUser(mapUser(authUser, profile));
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      currentSession = data.session;
      const sessionIsActive = scheduleSessionExpiry(currentSession);
      setSession(sessionIsActive ? data.session : null);
      if (!sessionIsActive) {
        setUser(null);
        setLoading(false);
        return;
      }
      syncUser(data.session?.user ?? null).finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "SIGNED_IN") {
        window.localStorage.setItem(LAST_ACTIVITY_AT_KEY, String(Date.now()));
      }

      currentSession = nextSession;
      const sessionIsActive = scheduleSessionExpiry(currentSession);
      setSession(sessionIsActive ? currentSession : null);
      if (!sessionIsActive) {
        setUser(null);
        setLoading(false);
        return;
      }
      syncUser(nextSession?.user ?? null);
      setLoading(false);
    });

    const activityEvents = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
      "visibilitychange",
    ];
    activityEvents.forEach(eventName => {
      window.addEventListener(eventName, recordActivity, { passive: true });
    });

    return () => {
      isMounted = false;
      clearSessionTimeout();
      activityEvents.forEach(eventName => {
        window.removeEventListener(eventName, recordActivity);
      });
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await logoutUser();
    setUser(null);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isAuthenticated: Boolean(session),
      signOut,
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
