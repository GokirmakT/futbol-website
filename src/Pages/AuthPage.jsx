import { useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AuthPage = () => {
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [signInData, setSignInData] = useState({
    identifier: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] =
    useState(false);

  const handleModeChange = (_e, newValue) => {
    setMode(newValue);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const validateSignIn = () => {
    if (!signInData.identifier.trim()) {
      return "Email veya kullanıcı adı zorunlu.";
    }
    if (!signInData.password || signInData.password.length < 6) {
      return "Şifre en az 6 karakter olmalı.";
    }
    return "";
  };

  const validateSignUp = () => {
    const { username, email, password, confirmPassword } = signUpData;
    if (!username.trim()) return "Kullanıcı adı zorunlu.";
    if (!email.trim()) return "Email zorunlu.";
    if (!validateEmail(email)) return "Geçerli bir email girin.";
    if (!password || password.length < 6)
      return "Şifre en az 6 karakter olmalı.";
    if (password !== confirmPassword)
      return "Şifre ve şifre tekrar aynı olmalı.";
    return "";
  };

  const handleSignInSubmit = async e => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateSignIn();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: signInData.identifier,
          password: signInData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Giriş başarısız.");
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      setSuccessMessage("Başarıyla giriş yapıldı.");
      // İstersen burada redirect yapabilirsin:
      // window.location.href = "/TodayMatches";
    } catch (err) {
      setErrorMessage(err.message || "Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async e => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateSignUp();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signUpData.username,
          email: signUpData.email,
          password: signUpData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Kayıt işlemi başarısız.");
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      setSuccessMessage("Kayıt başarılı. Giriş yapabilirsiniz.");
      // İstersen otomatik signin moduna geç:
      // setMode("signin");
    } catch (err) {
      setErrorMessage(err.message || "Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #263238 0, #1b2838 40%, #0f172a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        }}
      >
        <Tabs
          value={mode}
          onChange={handleModeChange}
          variant="fullWidth"
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: "#22c55e" } }}
          sx={{
            background:
              "linear-gradient(90deg, rgba(56,189,248,0.25), rgba(34,197,94,0.35))",
          }}
        >
          <Tab
            label="Giriş Yap"
            value="signin"
            sx={{ fontWeight: "bold", textTransform: "none" }}
          />
          <Tab
            label="Kayıt Ol"
            value="signup"
            sx={{ fontWeight: "bold", textTransform: "none" }}
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" mb={0.5}>
            Futbol İstatistik Platformu
          </Typography>
          <Typography variant="body2" color="grey.400" mb={2}>
            Maç verilerine erişmek için hesap oluştur veya giriş yap.
          </Typography>

          {errorMessage && (
            <Alert
              severity="error"
              sx={{ mb: 2, backgroundColor: "rgba(248, 113, 113, 0.1)" }}
            >
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert
              severity="success"
              sx={{ mb: 2, backgroundColor: "rgba(74, 222, 128, 0.1)" }}
            >
              {successMessage}
            </Alert>
          )}

          <Fade in={mode === "signin"} timeout={300} unmountOnExit>
            <Box
              component="form"
              onSubmit={handleSignInSubmit}
              sx={{
                display: mode === "signin" ? "block" : "none",
              }}
            >
              <TextField
                label="Email veya Kullanıcı Adı"
                variant="outlined"
                fullWidth
                margin="normal"
                value={signInData.identifier}
                onChange={e =>
                  setSignInData(s => ({ ...s, identifier: e.target.value }))
                }
                InputProps={{
                  sx: {
                    color: "#fff",
                  },
                }}
              />

              <TextField
                label="Şifre"
                variant="outlined"
                fullWidth
                margin="normal"
                type={showSignInPassword ? "text" : "password"}
                value={signInData.password}
                onChange={e =>
                  setSignInData(s => ({ ...s, password: e.target.value }))
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setShowSignInPassword(prev => !prev)
                        }
                        sx={{ color: "#cbd5f5" }}
                      >
                        {showSignInPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    color: "#fff",
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: "bold",
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #22c55e, #16a34a)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #16a34a, #15803d)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </Box>
          </Fade>

          <Fade in={mode === "signup"} timeout={300} unmountOnExit>
            <Box
              component="form"
              onSubmit={handleSignUpSubmit}
              sx={{
                display: mode === "signup" ? "block" : "none",
              }}
            >
              <TextField
                label="Kullanıcı Adı"
                variant="outlined"
                fullWidth
                margin="normal"
                value={signUpData.username}
                onChange={e =>
                  setSignUpData(s => ({ ...s, username: e.target.value }))
                }
                InputProps={{
                  sx: { color: "#fff" },
                }}
              />

              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={signUpData.email}
                onChange={e =>
                  setSignUpData(s => ({ ...s, email: e.target.value }))
                }
                InputProps={{
                  sx: { color: "#fff" },
                }}
              />

              <TextField
                label="Şifre"
                variant="outlined"
                fullWidth
                margin="normal"
                type={showSignUpPassword ? "text" : "password"}
                value={signUpData.password}
                onChange={e =>
                  setSignUpData(s => ({ ...s, password: e.target.value }))
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setShowSignUpPassword(prev => !prev)
                        }
                        sx={{ color: "#cbd5f5" }}
                      >
                        {showSignUpPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { color: "#fff" },
                }}
              />

              <TextField
                label="Şifre Tekrar"
                variant="outlined"
                fullWidth
                margin="normal"
                type={showSignUpConfirmPassword ? "text" : "password"}
                value={signUpData.confirmPassword}
                onChange={e =>
                  setSignUpData(s => ({
                    ...s,
                    confirmPassword: e.target.value,
                  }))
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setShowSignUpConfirmPassword(prev => !prev)
                        }
                        sx={{ color: "#cbd5f5" }}
                      >
                        {showSignUpConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { color: "#fff" },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.2,
                  fontWeight: "bold",
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #22c55e, #16a34a)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #16a34a, #15803d)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Kayıt Ol"
                )}
              </Button>
            </Box>
          </Fade>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthPage;

