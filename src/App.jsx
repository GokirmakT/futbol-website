import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import Header from "./Components/Header.jsx";
import PageLoader from "./Components/LoadingPage.jsx";
import DataProvider from "./context/DataProvider.jsx";
import Card from "./Pages/Card.jsx";
import Corners from "./Pages/Corners.jsx";
import Goal from "./Pages/Goal.jsx";
import TodayMatches from "./Pages/TodayMatches.jsx";
import Standings from "./Pages/Standings.jsx";
import Statistics from "./Pages/Statistics.jsx";
import TeamDetail from "./Pages/TeamDetail.jsx";
import MatchDetail from "./Pages/MatchDetail.jsx";
import IyMsAnalysis from "./Pages/IyMsAnalysis.jsx";
import AuthPage from "./Pages/AuthPage.jsx";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    const openAuth = authMode => navigate("/auth", {
      state: {
        from: `${location.pathname}${location.search}${location.hash}`,
        authMode,
      },
    });

    return (
      <>
        <TodayMatches />
        <Dialog
          open
          onClose={() => navigate("/TodayMatches", { replace: true })}
          aria-labelledby="membership-dialog-title"
          aria-describedby="membership-dialog-description"
          maxWidth="xs"
          fullWidth
          slotProps={{
            backdrop: { sx: { backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(3px)" } },
          }}
          PaperProps={{
            sx: {
              border: "1px solid #303638",
              borderRadius: "12px",
              backgroundColor: "#171b1d",
              color: "#f4f5f5",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.45)",
            },
          }}
        >
          <DialogTitle id="membership-dialog-title" sx={{ pt: 3.5, pb: 1, fontSize: "1.35rem", fontWeight: 750 }}>
            Maç analizlerine eriş
          </DialogTitle>
          <DialogContent sx={{ pb: 1 }}>
            <Typography id="membership-dialog-description" sx={{ color: "#aeb6b8", lineHeight: 1.6 }}>
              Maç detayları ve tüm analiz özelliklerini kullanmak için üye olman gerekiyor.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
            <Stack width="100%" spacing={1.25}>
              <Button
                variant="contained"
                onClick={() => openAuth("register")}
                sx={{ minHeight: 48, borderRadius: "8px", backgroundColor: "#1976d2", color: "#fff", fontWeight: 700, textTransform: "none", "&:hover": { backgroundColor: "#1565c0" } }}
              >
                Ücretsiz üye ol
              </Button>
              <Button
                variant="outlined"
                onClick={() => openAuth("login")}
                sx={{ minHeight: 46, borderColor: "#626b6e", borderRadius: "8px", color: "#f4f5f5", textTransform: "none", "&:hover": { borderColor: "#1976d2", backgroundColor: "#222729" } }}
              >
                Zaten üyeyim, giriş yap
              </Button>
              <Button
                onClick={() => navigate("/TodayMatches", { replace: true })}
                sx={{ minHeight: 40, color: "#aeb6b8", textTransform: "none", "&:hover": { color: "#fff", backgroundColor: "transparent" } }}
              >
                Şimdi değil
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return children;
}

function GuestOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || "/TodayMatches"} replace />;
  }

  return children;
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <DataProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/TodayMatches" replace />} />
        <Route path="/TodayMatches" element={<TodayMatches />} />
        <Route path="/lig/:leagueId" element={<ProtectedRoute><Standings /></ProtectedRoute>} />
        <Route path="/Cards" element={<ProtectedRoute><Card /></ProtectedRoute>} />
        <Route path="/Corners" element={<ProtectedRoute><Corners /></ProtectedRoute>} />
        <Route path="/Goals" element={<ProtectedRoute><Goal /></ProtectedRoute>} />
        <Route path="/Statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
        <Route path="/team/:league/:team" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
        <Route path="/match/:league/:home/:away" element={<ProtectedRoute><MatchDetail /></ProtectedRoute>} />
        <Route path="/iy-ms" element={<ProtectedRoute><IyMsAnalysis /></ProtectedRoute>} />
        <Route path="/auth" element={<GuestOnlyRoute><AuthPage /></GuestOnlyRoute>} />
        <Route path="*" element={<Navigate to="/TodayMatches" replace />} />
      </Routes>
    </DataProvider>
  );
}