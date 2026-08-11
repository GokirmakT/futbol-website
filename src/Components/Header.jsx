import {
  AppBar,
  Toolbar,
  TextField,
  Button,
  Stack,
  Box,
  Menu,
  MenuItem, IconButton, Avatar, Typography
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { getTeamLogo } from "./teamLogos.js";

const leagueSlugMap = {
  "Super Lig": "superlig",
  "Süper Lig": "superlig",
  "Premier League": "premier-league",
  "LaLiga": "laliga",
  "Serie A": "seriea",
  Bundesliga: "bundesliga",
  "Ligue 1": "ligue1",
  Eredivisie: "eredivisie",
  "UEFA Champions League": "champions-league",
  "UEFA Europa League": "europa-league",
  "UEFA Europa Conference League": "europa-conference-league",
  "Primeira Liga": "primeira-liga",
  "Pro League": "pro-league",
  "Saudi Pro League": "saudi-pro-league",
  "UEFA Champions League Qualifying": "uefa-champions-league-qualifying",
  "UEFA Europa League Qualifying": "uefa-europa-league-qualifying",
  "UEFA Conference League Qualifying": "uefa-conference-league-qualifying",
};

const normalizeSearch = value => String(value ?? "")
  .trim()
  .toLocaleLowerCase("tr-TR")
  .replace(/[ıİ]/g, "i")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/ı/g, "i");

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matches, setSelectedLeague } = useData();
  const { user, isAuthenticated, signOut } = useAuth();
  const [searchValue, setSearchValue] = useState("");

  // MOBILE ana menü
  const [menuAnchor, setMenuAnchor] = useState(null);

  // USER menu
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const isMobile = useMediaQuery("(max-width: 460px)");
  const headerButtons = useMediaQuery("(max-width: 1282px)");

  const searchSuggestions = useMemo(() => {
    const query = normalizeSearch(searchValue);
    if (!query || !matches?.length) return { teams: [], fixtures: [] };

    const teams = new Map();
    matches.forEach(match => {
      [match.homeTeam, match.awayTeam].forEach(teamName => {
        if (!teamName || !normalizeSearch(teamName).includes(query) || teams.has(teamName)) return;
        teams.set(teamName, { name: teamName, league: match.league });
      });
    });

    const fixtures = matches
      .filter(match => normalizeSearch(`${match.homeTeam} ${match.awayTeam}`).includes(query))
      .slice(0, 4);

    return {
      teams: [...teams.values()].slice(0, 5),
      fixtures
    };
  }, [matches, searchValue]);

  const hasSearchSuggestions = searchValue.trim() && (
    searchSuggestions.teams.length || searchSuggestions.fixtures.length
  );

  function handleTeamSearch() {
    const query = normalizeSearch(searchValue);
    if (!query || !matches?.length) return;

    const teamMatch = matches.find(match =>
      [match.homeTeam, match.awayTeam].some(teamName => normalizeSearch(teamName) === query)
    );

    if (!teamMatch) return;

    const teamName = normalizeSearch(teamMatch.homeTeam) === query
      ? teamMatch.homeTeam
      : teamMatch.awayTeam;
    const leagueSlug = leagueSlugMap[teamMatch.league] || teamMatch.league;
    setSelectedLeague(teamMatch.league);
    navigate(`/team/${encodeURIComponent(leagueSlug)}/${encodeURIComponent(teamName)}`);
  }

  function openTeam(teamName, teamLeague) {
    const leagueSlug = leagueSlugMap[teamLeague] || teamLeague;
    setSelectedLeague(teamLeague);
    setSearchValue("");
    navigate(`/team/${encodeURIComponent(leagueSlug)}/${encodeURIComponent(teamName)}`);
  }

  function openFixture(match) {
    const leagueSlug = leagueSlugMap[match.league] || match.league;
    setSearchValue("");
    navigate(`/match/${encodeURIComponent(leagueSlug)}/${encodeURIComponent(match.homeTeam)}/${encodeURIComponent(match.awayTeam)}`);
  }
  
  return (
    location.pathname === "/auth" ? (
      <AppBar position="sticky" elevation={1} sx={{ backgroundColor: "#1d1d1d", p: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          {isAuthenticated && (
            <Button variant="outlined" color="inherit" onClick={() => navigate("/TodayMatches")}>
              {user?.username || user?.email}
            </Button>
          )}
          <Button variant="contained" color="primary" onClick={() => document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth' })}>
            Giriş/Kayıt Ol
          </Button>
        </Toolbar>
      </AppBar>
    ) : (
      <AppBar position="sticky" elevation={1} sx={{ backgroundColor: "#1d1d1d", p: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* SOL: ARAMA */}
          <Box sx={{ width: "40%", minWidth: "220px", position: "relative" }}>
            <TextField
              fullWidth
              size="small"
              value={searchValue}
              onChange={event => setSearchValue(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter") handleTeamSearch();
              }}
              placeholder="Takım, maç veya lig ara..."
              sx={{
                backgroundColor: "#fff",
                borderRadius: 1,
                input: { color: "black" }
              }}
            />
            {hasSearchSuggestions && (
              <Box
                sx={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  zIndex: 1400,
                  overflow: "hidden",
                  borderRadius: 1,
                  backgroundColor: "#fff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.28)"
                }}
              >
                {searchSuggestions.fixtures.length > 0 && (
                  <>
                    <Typography sx={{ px: 1.5, pt: 1, pb: 0.5, color: "#777", fontSize: 12, fontWeight: "bold" }}>
                      Maçlar
                    </Typography>
                    {searchSuggestions.fixtures.map((match, index) => (
                      <Box
                        key={`${match.homeTeam}-${match.awayTeam}-${index}`}
                        onMouseDown={() => openFixture(match)}
                        sx={{
                          px: 1.5,
                          py: 1,
                          cursor: "pointer",
                          color: "#222",
                          borderTop: "1px solid #eee",
                          "&:hover": { backgroundColor: "#eef5fb" }
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold" noWrap>
                          {match.homeTeam} - {match.awayTeam}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {match.league} · {new Date(match.date).toLocaleDateString("tr-TR")}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
                {searchSuggestions.teams.length > 0 && (
                  <>
                    <Typography sx={{ px: 1.5, pt: 1, pb: 0.5, color: "#777", fontSize: 12, fontWeight: "bold" }}>
                      Takımlar
                    </Typography>
                    {searchSuggestions.teams.map(teamItem => (
                      <Box
                        key={`${teamItem.name}-${teamItem.league}`}
                        onMouseDown={() => openTeam(teamItem.name, teamItem.league)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          px: 1.5,
                          py: 1,
                          cursor: "pointer",
                          color: "#222",
                          borderTop: "1px solid #eee",
                          "&:hover": { backgroundColor: "#eef5fb" }
                        }}
                      >
                        <Box component="img" src={getTeamLogo(teamItem.name)} alt="" sx={{ width: 28, height: 28, objectFit: "contain" }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" fontWeight="bold" noWrap>{teamItem.name}</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>{teamItem.league}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            )}
          </Box>

          {/* SAĞ: MENÜLER */}
          <Stack direction="row" spacing={2} paddingLeft={1} alignItems="center">
           
            {/* ================= DESKTOP ================= */}
            {!headerButtons && (
              <>
              <Button
                variant="contained"
                startIcon={
                  <img
                    src="/stream.png"
                    alt="Bugünün maçları"
                    style={{ width: 20, height: 20 }}
                  />
                }
                onClick={() => navigate("/TodayMatches")}
              >
                Bugünün maçları
              </Button>
              <Button
                variant="contained"
                startIcon={
                  <img
                    src="/yellow-card.png"
                    alt="Kart"
                    style={{ width: 20, height: 20 }}
                  />
                }
                onClick={() => navigate("/Cards")}
              >
                Kart
              </Button>
              <Button
                variant="contained"
                startIcon={
                  <img
                    src="/corner.png"
                    alt="Korner"
                    style={{ width: 20, height: 20 }}
                  />
                }
                onClick={() => navigate("/Corners")}
              >
                Korner
              </Button>
              <Button
                variant="contained"
                startIcon={
                  <img
                    src="/football.png"
                    alt="Gol"
                    style={{ width: 20, height: 20 }}
                  />
                }
                onClick={() => navigate("/Goals")}
              >
                Gol
              </Button>
              <Button
                variant="contained"
                startIcon={
                  <img
                    src="/football.png"
                    alt="İy-Ms"
                    style={{ width: 20, height: 20 }}
                  />
                }
                onClick={() => navigate("/iy-ms")}
              >
                İy-Ms
              </Button>
              {isAuthenticated && (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  sx={{ width: 40, height: 40, p: 0 }}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "secondary.main" }}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase())}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={() => setUserMenuAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={async () => { setUserMenuAnchor(null); await signOut(); navigate("/auth"); }}>
                    Çıkış
                  </MenuItem>
                </Menu>
              </>
            )}
            </>
          )}

          {/* ================= MOBILE ================= */}
          {headerButtons && (
            <>
              <Button
                variant="contained"
                sx={{
                  width: isMobile ? "40px" : "80px",
                  minWidth: isMobile ? "40px" : "80px",
                  px: isMobile ? 0 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: isMobile ? 0 : "6px",
                }}
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                <img
                  src = "/burger-bar.png"
                  alt="menu"
                  style={{
                    width: 24,
                    height: 24,
                    filter: "invert(1)" // ikon beyaz olsun diye
                  }}
                />                
              </Button>

              {isAuthenticated && !isMobile && (
              <>
                <IconButton
                  size="small"
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  sx={{ width: 40, height: 40, p: 0 }}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "secondary.main" }}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase())}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={() => setUserMenuAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={async () => { setUserMenuAnchor(null); await signOut(); navigate("/auth"); }}>
                    Çıkış
                  </MenuItem>
                </Menu>
              </>
            )}


              {/* ANA MOBİL MENÜ */}
              <Menu
                sx={{ mt: "5px" }}
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => {
                  setMenuAnchor(null);
                }}
              >
                <MenuItem onClick={() => {navigate("/TodayMatches"); setMenuAnchor(null);}} sx={{gap: 0.5}}>
                  <img
                    src = "/stream.png"
                    alt="menu"
                    style={{
                      width: 24,
                      height: 24,                     
                    }}
                  />       
                  Bugünün maçları
                </MenuItem>

                <MenuItem onClick={() => {navigate("/Cards"); setMenuAnchor(null);}} sx={{gap: 0.5}}>
                <img
                    src = "/yellow-card.png"
                    alt="menu"
                    style={{
                      width: 24,
                      height: 24,                    
                    }}
                  />
                  Kart</MenuItem>
                <MenuItem onClick={() => {navigate("/Corners"); setMenuAnchor(null);}} sx={{gap: 0.5}}>
                <img
                    src = "/corner.png"
                    alt="menu"
                    style={{
                      width: 24,
                      height: 24,                     
                    }}
                  />
                  Korner</MenuItem>
                <MenuItem onClick={() => {navigate("/Goals"); setMenuAnchor(null);}} sx={{gap: 0.5}}>
                <img
                    src = "/football.png"
                    alt="menu"
                    style={{
                      width: 24,
                      height: 24,                                          
                    }}
                  />
                  Gol</MenuItem>
                <MenuItem onClick={() => {navigate("/iy-ms"); setMenuAnchor(null);}} sx={{gap: 0.5}}>
                <img
                    src = "/football.png"
                    alt="menu"
                    style={{
                      width: 24,
                      height: 24,                                          
                    }}
                  />
                  İy-Ms İstatistikleri</MenuItem>
                <MenuItem onClick={() => {navigate("/Statistics"); setMenuAnchor(null);}} sx={{gap: 0.5}}>
                <img
                    src = "/football.png"
                    alt="menu"
                    style={{
                      width: 24,
                      height: 24,                                          
                    }}
                  />
                  İstatistikler</MenuItem>
                  <MenuItem onClick={async () => { setUserMenuAnchor(null); await signOut(); navigate("/auth"); }}>
                    Çıkış
                  </MenuItem>
              </Menu>

            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
    )
  );
}
