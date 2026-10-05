import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { loginUser, registerUser } from "../api/auth";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(() => location.state?.authMode !== "register");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const changeMode = mode => {
    if (!mode) return;
    setIsLogin(mode === "login");
    setAuthError("");
    setAuthSuccess("");
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) return "E-posta ve şifre alanları zorunludur.";
    if (!isLogin && !username.trim()) return "Kullanıcı adı zorunludur.";
    if (!isLogin && password !== confirmPassword) return "Şifreler eşleşmiyor.";
    if (password.length < 6) return "Şifre en az 6 karakter olmalıdır.";
    return "";
  };

  const handleAuthSubmit = async event => {
    event.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setAuthError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = isLogin
        ? await loginUser({ email: email.trim(), password })
        : await registerUser({ username: username.trim(), email: email.trim(), password });

      if (payload?.needsEmailConfirmation) {
        setAuthSuccess("Kayıt başarılı. Giriş yapmadan önce e-posta adresinize gelen doğrulama linkine tıklayın.");
        return;
      }

      setAuthSuccess(isLogin ? "Giriş başarılı." : "Kayıt başarılı. Giriş yapıldı.");
      setTimeout(() => navigate(location.state?.from || "/TodayMatches", { replace: true }), 700);
    } catch (error) {
      setAuthError(error?.message || (isLogin ? "Giriş sırasında hata oluştu." : "Kayıt sırasında hata oluştu."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 56,
      borderRadius: "8px",
      backgroundColor: "#222729",
      "& fieldset": { borderColor: "#303638" },
      "&:hover fieldset": { borderColor: "#626b6e" },
      "&.Mui-focused fieldset": { borderColor: "#1976d2", borderWidth: 1.5 },
    },
    "& .MuiInputBase-input": { color: "#f4f5f5" },
    "& .MuiInputLabel-root": { color: "#aeb6b8" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },
  };

  return (
    <Box
      component="main"
      sx={{
        boxSizing: "border-box",
        minHeight: "100svh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.04fr) minmax(420px, 0.96fr)" },
        backgroundColor: "#101416",
        color: "#f4f5f5",
        fontFamily: "'DM Sans', sans-serif",
        "& > section": { boxSizing: "border-box" },
      }}
    >
      <Box
        component="section"
        aria-label="Futbol analiz"
        sx={{
          position: "relative",
          isolation: "isolate",
          minHeight: { xs: 230, md: "100svh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          px: { xs: 3, sm: 5, md: 7, lg: 9 },
          py: { xs: 2.5, md: 5 },
          color: "#f4f5f5",
          backgroundColor: "#171b1d",
          backgroundImage: "linear-gradient(90deg, rgba(8,10,11,.88), rgba(8,10,11,.55) 60%, rgba(8,10,11,.28)), linear-gradient(0deg, rgba(8,10,11,.72), transparent 55%), url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1800&q=85')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          "&::after": {
            content: '""',
            position: "absolute",
            zIndex: -1,
            inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "linear-gradient(transparent 8%, #000 100%)",
          },
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ position: "relative" }}>
          <Box sx={{ width: 38, height: 38, display: "grid", placeItems: "center", border: "1px solid rgba(244,245,245,.45)", borderRadius: "50%", color: "#1976d2" }}>
            <SportsSoccerRoundedIcon sx={{ fontSize: 21 }} />
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 800, letterSpacing: ".12em" }}>
            FUTBOL<span style={{ color: "#1976d2" }}>.</span>
          </Typography>
        </Stack>

        <Box sx={{ position: "relative", maxWidth: 620, py: { xs: 2, md: 0 }, animation: "auth-rise .7s ease-out both" }}>
          <Typography sx={{ mb: 2, color: "#64b5f6", fontSize: 11, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase" }}>
            Futbol, başka bir açıdan
          </Typography>
            <Typography component="h1" sx={{ maxWidth: 600, fontFamily: "'Barlow Condensed', sans-serif", fontSize: { xs: 38, md: 68, lg: 78 }, fontWeight: 700, lineHeight: 0.96, letterSpacing: 0, textTransform: "uppercase" }}>
            Oyunu sadece izleme.
            <Box component="span" sx={{ display: "block", color: "#64b5f6" }}>Oku.</Box>
          </Typography>
          <Typography sx={{ mt: 2.5, maxWidth: 380, color: "rgba(244,245,245,.78)", fontSize: 15, lineHeight: 1.7 }}>
            Her maçın içinde, skordan fazlası var.
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1.4} sx={{ position: "relative", pt: 2, borderTop: "1px solid rgba(244,245,245,.28)" }}>
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#1976d2" }} />
          <Typography sx={{ color: "rgba(244,245,245,.76)", fontSize: 11, fontWeight: 700, letterSpacing: ".12em" }}>
            FUTBOLUN HER DETAYI, TEK YERDE
          </Typography>
        </Stack>
      </Box>

      <Box
        component="section"
        sx={{ minHeight: { xs: 0, md: "100svh" }, display: "flex", alignItems: "center", justifyContent: "center", px: { xs: 2.5, sm: 5, md: 6, lg: 9 }, py: { xs: 3, md: 7 } }}
      >
        <Box sx={{ width: "100%", maxWidth: 430, animation: "auth-rise .7s .08s ease-out both", "@keyframes auth-rise": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4, color: "#aeb6b8" }}>
            <LockOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Güvenli oturum</Typography>
          </Stack>

          <Typography component="h2" sx={{ fontSize: 32, fontWeight: 750, letterSpacing: 0, lineHeight: 1.15 }}>
            {isLogin ? "Tekrar hoş geldin." : "Aramıza katıl."}
          </Typography>
          <Typography sx={{ mt: 1, mb: 3.5, color: "#aeb6b8", fontSize: 14, lineHeight: 1.6 }}>
            {isLogin ? "Hesabına giriş yap ve kaldığın yerden devam et." : "Hesabını oluştur, maçın detaylarına yaklaş."}
          </Typography>

          <ToggleButtonGroup
            exclusive
            value={isLogin ? "login" : "register"}
            onChange={(_, mode) => changeMode(mode)}
            aria-label="Giriş veya kayıt seçimi"
            fullWidth
            sx={{
              mb: 3,
              p: 0.5,
              border: "1px solid #303638",
              borderRadius: "9px",
              backgroundColor: "#222729",
              "& .MuiToggleButtonGroup-grouped": { border: 0, borderRadius: "6px !important" },
              "& .MuiToggleButton-root": { minHeight: 42, color: "#aeb6b8", fontSize: 13, fontWeight: 700, textTransform: "none" },
              "& .Mui-selected": { color: "#f4f5f5 !important", backgroundColor: "#171b1d !important", boxShadow: "0 1px 4px rgba(0,0,0,.3)" },
            }}
          >
            <ToggleButton value="login">Giriş yap</ToggleButton>
            <ToggleButton value="register">Kayıt ol</ToggleButton>
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleAuthSubmit} noValidate>
            <Stack spacing={1.8}>
              {!isLogin && (
                <TextField fullWidth label="Kullanıcı adı" value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineRoundedIcon sx={{ color: "#aeb6b8", fontSize: 20 }} /></InputAdornment> }}
                />
              )}
              <TextField fullWidth label="E-posta adresi" type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><AlternateEmailRoundedIcon sx={{ color: "#aeb6b8", fontSize: 20 }} /></InputAdornment> }}
              />
              <TextField fullWidth label="Şifre" type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} autoComplete={isLogin ? "current-password" : "new-password"} sx={fieldSx}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: "#aeb6b8", fontSize: 19 }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"} onClick={() => setShowPassword(value => !value)} edge="end" size="small" sx={{ color: "#f4f5f5" }}>{showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}</IconButton></InputAdornment>,
                }}
              />
              {!isLogin && (
                <TextField fullWidth label="Şifreyi tekrar gir" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} autoComplete="new-password" sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: "#aeb6b8", fontSize: 19 }} /></InputAdornment> }}
                />
              )}

              {!!authError && <Alert severity="error" sx={{ borderRadius: "8px" }}>{authError}</Alert>}
              {!!authSuccess && <Alert severity="success" sx={{ borderRadius: "8px" }}>{authSuccess}</Alert>}

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                endIcon={!isSubmitting && <ArrowForwardRoundedIcon />}
                sx={{ minHeight: 54, mt: 0.5, borderRadius: "8px", backgroundColor: "#1976d2", color: "#fff", fontSize: 14, fontWeight: 800, textTransform: "none", boxShadow: "none", "&:hover": { backgroundColor: "#1565c0", boxShadow: "0 8px 18px rgba(0,0,0,.25)" }, "&.Mui-disabled": { backgroundColor: "#303638", color: "#aeb6b8" } }}
              >
                {isSubmitting ? <CircularProgress size={21} sx={{ color: "#17231c" }} /> : isLogin ? "Giriş yap" : "Hesabını oluştur"}
              </Button>
              <Button
                component={Link}
                to="/TodayMatches"
                variant="outlined"
                startIcon={<SportsSoccerRoundedIcon />}
                sx={{ minHeight: 48, borderRadius: "8px", borderColor: "#626b6e", color: "#f4f5f5", fontSize: 13, fontWeight: 700, textTransform: "none", "&:hover": { borderColor: "#1976d2", backgroundColor: "#222729" } }}
              >
                Günün maçlarına bak
              </Button>
            </Stack>
          </Box>

          <Typography sx={{ mt: 3, color: "#aeb6b8", fontSize: 11, lineHeight: 1.6, textAlign: "center" }}>
            Devam ederek hesabına güvenli biçimde erişirsin.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthPage;
