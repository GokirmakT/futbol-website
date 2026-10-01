import { Stack, Box, Typography, Divider, TextField, Select, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getTeamLogo } from "../Components/teamLogos.js";
import corner from "/corner.png";
import redCard from "/cards.png";
import yellowCard from "/cards_y.png";
import shoot from "/kicking-ball.png";
import shootOnTarget from "/shoot-on-target.png";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useState } from "react";

const TeamFixture = ({ matches, team, league, display, selectedSeason, setSelectedSeason, availableSeasons = [], matchWidth = "60%", showResultColor = true, leagueFilter, setLeagueFilter, showSeasonFilter = true, showLeagueFilter = true, darkTheme = false }) => {
  const navigate = useNavigate();
  const isTablet = useMediaQuery("(max-width: 800px)");
  const isMobile = useMediaQuery("(max-width: 500px)");

  const teamLeagues = [...new Set(
  matches
    .filter(m => m.homeTeam === team || m.awayTeam === team)
    .map(m => m.league)
)];

  const [filters, setFilters] = useState({
    league: leagueFilter ?? "",
    shots: null,
    shotsOnTarget: null,
    corners: null,
    cornerWinner: null,
    penaltyScore: null,
    hasRedCard: false,
    result: null,
    goals: null,
  });
  
  const filteredMatches = matches.filter(m => {
    if (m.homeTeam !== team && m.awayTeam !== team) return false;
    const activeLeagueFilter = leagueFilter ?? filters.league;
    if (activeLeagueFilter && m.league !== activeLeagueFilter) return false;
    return true;
  });

  const checkMatchFilters = (m, f) => {
    if (f.corners && (m.cornerHome + m.cornerAway) < f.corners) return false;

    if (f.cornerWinner === "home" && m.cornerHome <= m.cornerAway) return false;
    if (f.cornerWinner === "away" && m.cornerAway <= m.cornerHome) return false;

    if (f.hasRedCard && (m.redHome + m.redAway) === 0) return false;

    if (
      f.penaltyScore &&
      (m.yellowHome + m.redHome * 2 + (m.yellowAway + m.redAway * 2)) < f.penaltyScore
    )
      return false;

    return true;
  };

  const isVisualFilterEmpty = Object.entries(filters)
    .filter(([key]) => key !== "league")
    .every(([, v]) => v === null || v === false);

  const matchesPassingAllFilters = filteredMatches.filter(m => {
    const isPlayed = m.winner !== "TBD";
    return isPlayed && checkMatchFilters(m, filters);
  });

  const getScoreColor = match => {
    if (!showResultColor) return "transparent";
    if (match.goalHome === match.goalAway) {
      return darkTheme ? "rgba(255, 209, 26, 0.28)" : "#ffd11a";
    }

    const isHome = team === match.homeTeam;
    const teamWon = isHome ? match.goalHome > match.goalAway : match.goalAway > match.goalHome;
    if (!darkTheme) return teamWon ? "#66ff66" : "#ff4d4d";

    return teamWon ? "rgba(102, 255, 102, 0.28)" : "rgba(255, 77, 77, 0.28)";
  };
    
  return (
    <Stack spacing={2} alignItems="center">
      
      <Stack direction="column" spacing={1} justifyContent="flex-end" display={display}>

        {showSeasonFilter && <Select
          size="small"
          value={selectedSeason ?? ""}
          displayEmpty
          onChange={e => setSelectedSeason?.(e.target.value)}
        >
          {availableSeasons.map(season => (
            <MenuItem key={season} value={season}>
              {season}
            </MenuItem>
          ))}
        </Select>}

        <Select
          size="small"
          value={filters.corners ?? ""}
          displayEmpty
          onChange={e => setFilters(f => ({ ...f, corners: e.target.value || null }))}
        >
          <MenuItem value="">Korner</MenuItem>
          <MenuItem value={7}>7+</MenuItem>
          <MenuItem value={9}>9+</MenuItem>
          <MenuItem value={11}>11+</MenuItem>
        </Select>

        {showLeagueFilter && <Select
          size="small"
          value={leagueFilter ?? filters.league}
          displayEmpty
          onChange={e =>
            setLeagueFilter
              ? setLeagueFilter(e.target.value)
              : setFilters(f => ({ ...f, league: e.target.value }))
          }
        >
          <MenuItem value="">Tüm Ligler</MenuItem>

          {teamLeagues.map(lg => (
            <MenuItem key={lg} value={lg}>
              {lg}
            </MenuItem>
          ))}
        </Select>}

        <Select
          size="small"
          value={filters.penaltyScore ?? ""}
          displayEmpty
          onChange={e => setFilters(f => ({ ...f, penaltyScore: e.target.value || null }))}
        >
          <MenuItem value="">Ceza Skoru</MenuItem>
          <MenuItem value={3}>2.5+</MenuItem>
          <MenuItem value={4}>3.5+</MenuItem>
          <MenuItem value={5}>4.5+</MenuItem>
        </Select>

        <Select
          size="small"
          value={filters.cornerWinner ?? ""}
          displayEmpty
          onChange={e => setFilters(f => ({ ...f, cornerWinner: e.target.value || null }))}
        >
          <MenuItem value="">Korner Üst.</MenuItem>
          <MenuItem value="home">Ev</MenuItem>
          <MenuItem value="away">Dep</MenuItem>
        </Select>

        <FormControlLabel
          control={
            <Checkbox
              checked={filters.hasRedCard}
              onChange={e =>
                setFilters(f => ({ ...f, hasRedCard: e.target.checked }))
              }
            />
          }
          label="Kırmızı"
        />
      </Stack>

      {/* Filtre sonucu maç sayısı (lig HARİÇ en az bir filtre aktifse) */}
      {!isVisualFilterEmpty && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Bu filtrelere uyan{" "}
          <strong>{matchesPassingAllFilters.length}</strong> maç bulundu.
        </Typography>
      )}

    <Stack spacing={2} width="100%" alignItems="center">
      {filteredMatches.map((m, i) => {
        const isPlayed = m.winner !== "TBD";  
        
        const passes = isPlayed && checkMatchFilters(m, filters);


        return (
          <Stack
            key={i}
            sx={{
              borderRadius: 2,
              backgroundColor: darkTheme
                ? !isPlayed
                  ? "#263945"
                  : isVisualFilterEmpty
                    ? "#252a2c"
                    : passes
                      ? "#244a31"
                      : "#4a292b"
                : !isPlayed
                  ? "#e3f2fd"
                  : isVisualFilterEmpty
                    ? "#f5f5f5"
                    : passes
                      ? "#a7faa7"
                      : "#fdecea",
              px: 1,
              py: 1,
              width: isTablet ? "95%" : matchWidth,
              maxWidth: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              border: darkTheme ? "1px solid rgba(255,255,255,0.1)" : undefined,
              overflow: "hidden"
            }}
            
          >
            {/* TARİH */}
            <Stack width="100%" direction="row" justifyContent="space-between">
                <Typography
                    variant="caption"
                    textAlign="right"
                  sx={{ color: darkTheme ? "rgba(255,255,255,0.68)" : "text.secondary" }}
                 >
                    {m.league}
                 </Typography>

                 <Typography
                    variant="caption"
                    textAlign="right"
                    sx={{ color: darkTheme ? "rgba(255,255,255,0.68)" : "text.secondary" }}
                 >
                    {new Date(m.date).toLocaleDateString("tr-TR")}
                 </Typography>
            </Stack>
           
          
            {/* GRID ROW */}
            <Box
              sx={{
                display: "grid",
                width: "100%",
                minWidth: 0,
                gridTemplateColumns: "auto minmax(0,1fr) 48px minmax(0,1fr) auto",
                alignItems: "center",
                columnGap: 1
              }}
            >
              {/* HOME LOGO */}
              <img
                src={getTeamLogo(m.homeTeam)}
                alt={m.homeTeam}
                width={28}
                height={28}
              />
          
              {/* HOME NAME */}
              <Typography
                fontWeight="bold"
                fontSize={isMobile ? "14px" : "18px"}
                noWrap
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  color: darkTheme ? "#f4f5f5" : undefined,
                  "&:hover": {
                    textDecoration: "underline",
                    color: darkTheme ? "#5eead4" : "primary.main"
                  }
                }}
                title={m.homeTeam}
                textAlign="left"
                onClick={() =>
                        navigate(`/team/${league}/${m.homeTeam}`)
                      }
              >
                {m.homeTeam}
              </Typography>
          
              {/* SCORE */}
              <Stack sx={{ backgroundColor: getScoreColor(m), color: darkTheme ? "#f4f5f5" : undefined }}>
                <Typography
                    fontWeight="bold"
                    fontSize={isMobile ? "14px" : "18px"}
                    textAlign="center"
                >
                    {isPlayed ? `${m.goalHome} - ${m.goalAway}` : "-"}
                </Typography>
              </Stack>                
          
              {/* AWAY NAME */}
              <Typography
                fontWeight="bold"
                fontSize={isMobile ? "14px" : "18px"}
                noWrap
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  color: darkTheme ? "#f4f5f5" : undefined,
                  "&:hover": {
                    textDecoration: "underline",
                    color: darkTheme ? "#5eead4" : "primary.main"
                  }
                }}                
                title={m.awayTeam}
                textAlign="right"
                 onClick={() =>
                        navigate(`/team/${league}/${m.awayTeam}`)
                      }
              >
                {m.awayTeam}
              </Typography>
          
              {/* AWAY LOGO */}
              <img
                src={getTeamLogo(m.awayTeam)}
                alt={m.awayTeam}
                width={28}
                height={28}                
              />
            </Box>

            {/* İSTATİSTİKLER */}
            {isPlayed && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={4}
                  mt={2}
                  sx={darkTheme ? {
                    color: "#f4f5f5",
                    "& img[src='/kicking-ball.png'], & img[src='/shoot-on-target.png'], & img[src='/corner.png']": {
                      filter: "brightness(0) invert(1)",
                    },
                  } : undefined}
                >

                    <Stack alignItems="center" direction="row" spacing={1} flex={1}>
                        <Stack alignItems="center" direction="row" spacing={0.5} flex={1}>
                           
                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={shoot} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.shotsHome}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={shootOnTarget} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.shotsOnTargetHome}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={corner} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.cornerHome}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={yellowCard} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.yellowHome}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={redCard} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.redHome}
                                </Typography>
                            </Stack>  
                        </Stack>

                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                mx: isMobile ? 1 : 2,   // 👉 sağ-sol boşluk
                                borderColor: darkTheme ? "rgba(255,255,255,0.28)" : "#ccc",
                                opacity: 1
                            }}
                            />
     


                        <Stack alignItems="center" direction="row" spacing={0.5} flex={1}>
                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={shoot} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.shotsAway}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={shootOnTarget} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.shotsOnTargetAway}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={corner} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.cornerAway}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={yellowCard} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.yellowAway}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={redCard} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.redAway}
                                </Typography>
                            </Stack>                            
                        </Stack>
                    </Stack>

                </Stack>
            )}


          </Stack>
          
        );
      })}
    </Stack>
  </Stack>
  );
};

export default TeamFixture;
