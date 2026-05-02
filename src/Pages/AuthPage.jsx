import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { loginUser, registerUser } from "../api/api";

const AuthPage = () => {
  const navigate = useNavigate();
  const heroSliderImages = ["/slider1.PNG", "/slider1-2.PNG"];
  const secondSectionSliderImages = ["/slider2.PNG", "/slider2-2.PNG"];
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [secondSlideIndex, setSecondSlideIndex] = useState(0);

  // Form states
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHeroSlideIndex(prev =>
        prev === heroSliderImages.length - 1 ? 0 : prev + 1
      );
    }, 4200);

    return () => clearInterval(intervalId);
  }, [heroSliderImages.length]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondSlideIndex(prev =>
        prev === secondSectionSliderImages.length - 1 ? 0 : prev + 1
      );
    }, 4200);

    return () => clearInterval(intervalId);
  }, [secondSectionSliderImages.length]);

  useEffect(() => {
    setAuthError("");
    setAuthSuccess("");
  }, [isLogin]);

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      return "E-posta ve şifre alanları zorunludur.";
    }
    if (!isLogin && !username.trim()) {
      return "Kullanıcı adı zorunludur.";
    }
    if (!isLogin && password !== confirmPassword) {
      return "Şifreler eşleşmiyor.";
    }
    if (password.length < 6) {
      return "Şifre en az 6 karakter olmalıdır.";
    }
    return "";
  };

  const handleAuthSubmit = async e => {
    e.preventDefault();
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

      const token = payload?.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      if (payload?.user) {
        localStorage.setItem("user", JSON.stringify(payload.user));
      }

      setAuthSuccess(isLogin ? "Giriş başarılı." : "Kayıt başarılı. Giriş yapıldı.");
      setTimeout(() => {
        navigate("/TodayMatches");
      }, 700);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        (isLogin ? "Giriş sırasında hata oluştu." : "Kayıt sırasında hata oluştu.");
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionImageSx = {
    width: "100%",
    height: { xs: 320, md: 430 },
    objectFit: "cover",
    borderRadius: "24px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.14)",
  };

  const pillButtonSx = {
    borderRadius: "999px",
    px: 3,
    py: 1.15,
    fontWeight: 700,
    textTransform: "none",
    transition: "all 0.25s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 22px rgba(99, 102, 241, 0.2)",
    },
  };

  const SplitSection = ({
    title,
    description,
    image,
    imageSliderImages,
    activeSlideIndex = 0,
    imageAlt,
    imageRightDesktop = false,
    actions,
  }) => (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 5, md: imageRightDesktop ? 0 : 8}}
        alignItems="center"
      >
        <Box sx={{ width: { xs: "100%", md: "100%" }, order: { xs: 1, md: imageRightDesktop ? 2 : 1 } }}>
          {Array.isArray(imageSliderImages) && imageSliderImages.length > 0 ? (
            <Box sx={{ position: "relative", ...sectionImageSx, overflow: "hidden" }}>
              {imageSliderImages.map((sliderImage, index) => (
                <Box
                  key={sliderImage}
                  component="img"
                  src={sliderImage}
                  alt={`${imageAlt} ${index + 1}`}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                    opacity: activeSlideIndex === index ? 1 : 0,
                    transition: "opacity 900ms ease-in-out",
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box
              component="img"
              src={image}
              alt={imageAlt}
              sx={sectionImageSx}
            />
          )}
        </Box>
        <Box sx={{ width: { xs: "100%", md: "70%" }, order: { xs: 2, md: imageRightDesktop ? 1 : 2 } }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ mb: 2, letterSpacing: "0.02em" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3.5, whiteSpace: "pre-line" }}
          >
            {description}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {actions}
          </Box>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <Container maxWidth="100%" sx={{ py: { xs: 6, md: 6 } }}>
        <SplitSection
          title="VERİYLE BAHİS YAPIN"
          description={"Futbol bahislerinde sezgilere degil, guclu verilere dayali kararlar alin. Platformumuz, gelismis istatistikler, gecmis mac analizleri ve gercek zamanli verilerle farkli bahis seceneklerini detayli sekilde degerlendirmenizi saglar. Akilli filtreleme araclari sayesinde oranlari karsilastirabilir, maclarin olasiliklarini daha net analiz edebilir ve riskleri daha kontrollu bir sekilde yonetebilirsiniz.\n\nBoylece yalnizca tahminlere dayali degil, veriye dayali stratejiler gelistirerek daha bilincli, daha planli ve daha surdurulebilir bahis kararlari alabilirsiniz."}
          image={heroSliderImages[heroSlideIndex]}
          imageSliderImages={heroSliderImages}
          activeSlideIndex={heroSlideIndex}
          imageAlt="Futbol sahasi gorunumu"
          actions={
            <>
              <Button
                variant="contained"
                color="error"
                sx={{ ...pillButtonSx, boxShadow: "0 10px 20px rgba(220, 38, 38, 0.24)" }}
              >
                VERI AKISLARI
              </Button>
              <Button variant="outlined" color="error" sx={pillButtonSx}>
                CANLI TAKIPCI
              </Button>
              <Button variant="outlined" color="error" sx={pillButtonSx}>
                WIDGETS
              </Button>
            </>
          }
        />

        <SplitSection
          title="EN GENIS KAPSAM"
          description="Ligdeki tum maclari, canli olasilik hareketlerini ve derin mac istatistiklerini tek bir akisla izleyin. Veri odakli kararlar icin hizli ve guvenilir altyapi."
          image={secondSectionSliderImages[secondSlideIndex]}
          imageSliderImages={secondSectionSliderImages}
          activeSlideIndex={secondSlideIndex}
          imageAlt="Stadyum ve taraftarlar"
          imageRightDesktop
          actions={
            <Button variant="contained" color="error" sx={pillButtonSx}>
              KAPSAMI GOR
            </Button>
          }
        />

        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 5, md: 8 }}
            alignItems="center"
          >
            <Box sx={{ width: { xs: "100%", md: "50%" }, order: { xs: 1, md: 1 } }}>
              <Box
                sx={{
                  position: "relative",
                  minHeight: { xs: 340, md: 400 },
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=900&q=80"
                  alt="YouTube canli yayin paneli"
                  sx={{
                    width: { xs: "85%", md: "82%" },
                    height: { xs: 260, md: 300 },
                    objectFit: "cover",
                    borderRadius: "24px",
                    boxShadow: "0 18px 34px rgba(15, 23, 42, 0.2)",
                  }}
                />
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
                  alt="Dashboard analiz ekrani"
                  sx={{
                    position: "absolute",
                    right: { xs: 0, md: 14 },
                    bottom: 0,
                    width: { xs: "62%", md: "58%" },
                    height: { xs: 190, md: 210 },
                    objectFit: "cover",
                    borderRadius: "22px",
                    border: "6px solid #f8fafc",
                    boxShadow: "0 16px 32px rgba(15, 23, 42, 0.22)",
                  }}
                />
              </Box>
            </Box>
            <Box
              id="auth-form"
              component="form"
              onSubmit={handleAuthSubmit}
              sx={{ width: { xs: "100%", md: "50%" }, order: { xs: 2, md: 2 }, p: 3, backgroundColor: "#fff", borderRadius: "24px", boxShadow: "0 14px 34px rgba(15, 23, 42, 0.14)" }}
            >
              <Typography variant="h4" fontWeight={800} sx={{ mb: 3, textAlign: "center" }}>
                {isLogin ? "Giriş Yap" : "Kayıt Ol"}
              </Typography>
              {!!authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}
              {!!authSuccess && <Alert severity="success" sx={{ mb: 2 }}>{authSuccess}</Alert>}
              <Stack spacing={2}>
                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Kullanıcı Adı"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                )}
                <TextField
                  fullWidth
                  label="E-posta"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Şifre"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />
                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Şifre Tekrar"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  disabled={isSubmitting}
                  sx={{ ...pillButtonSx, width: "100%" }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : isLogin ? (
                    "Giriş Yap"
                  ) : (
                    "Kayıt Ol"
                  )}
                </Button>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Typography variant="body2">
                    {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}
                  </Typography>
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setConfirmPassword("");
                    }}
                    sx={{ p: 0, minWidth: "auto" }}
                  >
                    {isLogin ? "Kayıt Ol" : "Giriş Yap"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;
