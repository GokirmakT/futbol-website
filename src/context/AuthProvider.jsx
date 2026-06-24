import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { logoutUser } from "../api/auth";
import { AuthContext } from "./AuthContext";

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

      setSession(data.session);
      syncUser(data.session?.user ?? null).finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      syncUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
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
