import { supabase } from "../lib/supabase";

const mapAuthUser = (user, profile) => ({
  id: user.id,
  email: user.email,
  username:
    profile?.username ||
    user.user_metadata?.username ||
    user.email?.split("@")[0] ||
    "",
});

const mapAuthError = (message, fallback) => {
  const normalized = (message || "").toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "E-posta veya şifre hatalı.";
  }
  if (normalized.includes("user already registered")) {
    return "Bu e-posta adresi zaten kayıtlı.";
  }
  if (normalized.includes("password should be at least")) {
    return "Şifre en az 6 karakter olmalıdır.";
  }
  if (normalized.includes("unable to validate email address")) {
    return "Geçerli bir e-posta adresi girin.";
  }
  if (normalized.includes("email not confirmed")) {
    return "E-posta adresiniz henüz doğrulanmadı. Lütfen gelen kutunuzu kontrol edin.";
  }

  return message || fallback;
};

const getProfile = async userId => {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(mapAuthError(error.message, "Giriş sırasında hata oluştu."));
  }

  const profile = await getProfile(data.user.id);

  return {
    user: mapAuthUser(data.user, profile),
    session: data.session,
    needsEmailConfirmation: false,
  };
};

export const registerUser = async ({ username, email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error) {
    throw new Error(mapAuthError(error.message, "Kayıt sırasında hata oluştu."));
  }

  if (!data.user) {
    throw new Error("Kayıt sırasında hata oluştu.");
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      username,
      email,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    console.warn("Profil kaydi olusturulamadi:", profileError.message);
  }

  return {
    user: mapAuthUser(data.user, { username }),
    session: data.session,
    needsEmailConfirmation: !data.session,
  };
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(mapAuthError(error.message, "Çıkış sırasında hata oluştu."));
  }
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }
  return data.session;
};
