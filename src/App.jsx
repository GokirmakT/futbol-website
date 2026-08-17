import { Route, Routes, Navigate } from "react-router-dom";
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

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <DataProvider>{children}</DataProvider>;
}

function GuestOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/TodayMatches" replace />;
  }

  return children;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/TodayMatches" : "/auth"} replace />} />
        <Route path="/TodayMatches" element={<ProtectedRoute><TodayMatches /></ProtectedRoute>} />
        <Route path="/lig/:leagueId" element={<ProtectedRoute><Standings /></ProtectedRoute>} />
        <Route path="/Cards" element={<ProtectedRoute><Card /></ProtectedRoute>} />
        <Route path="/Corners" element={<ProtectedRoute><Corners /></ProtectedRoute>} />
        <Route path="/Goals" element={<ProtectedRoute><Goal /></ProtectedRoute>} />
        <Route path="/Statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
        <Route path="/team/:league/:team" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
        <Route path="/match/:league/:home/:away" element={<ProtectedRoute><MatchDetail /></ProtectedRoute>} />
        <Route path="/iy-ms" element={<ProtectedRoute><IyMsAnalysis /></ProtectedRoute>} />
        <Route path="/auth" element={<GuestOnlyRoute><AuthPage /></GuestOnlyRoute>} />
      </Routes>
    </>
  );
}