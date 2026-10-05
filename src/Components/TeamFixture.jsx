import { Stack, Box, Typography, Divider, Button, Select, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
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
    corners: "",
    cornerWinner: "",
    penaltyScore: "",
    hasRedCard: false,
    result: "",
    goals: "",
    shotsOnTarget: "",
  });
  
  const filteredMatches = matches.filter(m => {
    if (m.homeTeam !== team && m.awayTeam !== team) return false;
    const activeLeagueFilter = leagueFilter ?? filters.league;
    if (activeLeagueFilter && m.league !== activeLeagueFilter) return false;
    return true;
  });

  const checkMatchFilters = (m, f) => {
    const homeGoals = Number(m.goalHome) || 0;
    const awayGoals = Number(m.goalAway) || 0;
    const homeCorners = Number(m.cornerHome) || 0;
    const awayCorners = Number(m.cornerAway) || 0;
    const teamIsHome = m.homeTeam === team;
    const teamGoals = teamIsHome ? homeGoals : awayGoals;
    const opponentGoals = teamIsHome ? awayGoals : homeGoals;
    const teamCorners = teamIsHome ? homeCorners : awayCorners;
    const opponentCorners = teamIsHome ? awayCorners : homeCorners;
    const totalGoals = homeGoals + awayGoals;
    const totalCorners = homeCorners + awayCorners;
    const totalPenaltyScore =
      (Number(m.yellowHome) || 0) + (Number(m.yellowAway) || 0) +
      (Number(m.redHome) || 0) * 2 + (Number(m.redAway) || 0) * 2;
    const totalShotsOnTarget =
      (Number(m.shotsOnTargetHome) || 0) + (Number(m.shotsOnTargetAway) || 0);

    if (f.corners !== "" && totalCorners <= Number(f.corners)) return false;
    if (f.cornerWinner === "team" && teamCorners <= opponentCorners) return false;
    if (f.cornerWinner === "opponent" && opponentCorners <= teamCorners) return false;
    if (f.cornerWinner === "draw" && teamCorners !== opponentCorners) return false;
    if (f.hasRedCard && (Number(m.redHome) + Number(m.redAway)) === 0) return false;
    if (f.penaltyScore !== "" && totalPenaltyScore <= Number(f.penaltyScore)) return false;
    if (f.shotsOnTarget !== "" && totalShotsOnTarget < Number(f.shotsOnTarget)) return false;

    if (f.goals === "over15" && totalGoals <= 1.5) return false;
    if (f.goals === "over25" && totalGoals <= 2.5) return false;
    if (f.goals === "over35" && totalGoals <= 3.5) return false;
    if (f.goals === "under25" && totalGoals >= 2.5) return false;
    if (f.goals === "btts" && (teamGoals === 0 || opponentGoals === 0)) return false;

    const teamResult = teamGoals > opponentGoals ? "win" : teamGoals < opponentGoals ? "loss" : "draw";
    if (f.result && teamResult !== f.result) return false;

    return true;
  };

  const isVisualFilterEmpty = Object.entries(filters)
    .filter(([key]) => key !== "league")
    .every(([, value]) => value === "" || value === null || value === false);

  const matchesPassingAllFilters = filteredMatches.filter(m => {
    const isPlayed = m.winner !== "TBD";
    return isPlayed && checkMatchFilters(m, filters);
  });
  const matchesToDisplay = filteredMatches;
  const playedMatchCount = filteredMatches.filter(match => match.winner !== "TBD").length;
  const matchColumnWidth = isTablet ? "95%" : matchWidth;

  const resetFilters = () => setFilters({
    league: leagueFilter ?? "",
    corners: "",
    cornerWinner: "",
    penaltyScore: "",
    hasRedCard: false,
    result: "",
    goals: "",
    shotsOnTarget: "",
  });

  const filterSelectSx = {
    minWidth: 0,
    color: darkTheme ? "#f4f5f5" : "text.primary",
    backgroundColor: darkTheme ? "#171b1d" : "#fff",
    ".MuiOutlinedInput-notchedOutline": { borderColor: darkTheme ? "#465055" : "#d0d7dc" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: darkTheme ? "#77868c" : "#8d9ba3" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: darkTheme ? "#5eead4" : "primary.main" },
    ".MuiSvgIcon-root": { color: darkTheme ? "#c2cccf" : "text.secondary" },
  };
  const filterMenuProps = {
    PaperProps: {
      sx: darkTheme ? { backgroundColor: "#252a2c", color: "#f4f5f5" } : undefined,
    },
  };

  const renderFilterSelect = (label, value, onChange, options) => (
    <Select
      size="small"
      fullWidth
      displayEmpty
      value={value}
      onChange={onChange}
      inputProps={{ "aria-label": label }}
      sx={filterSelectSx}
      MenuProps={filterMenuProps}
    >
      <MenuItem value="">{label}</MenuItem>
      {options.map(option => (
        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
      ))}
    </Select>
  );

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
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        display: display === "none" ? "none" : "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack spacing={1.5} width={matchColumnWidth}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
            gap: 1,
            width: "100%",
            p: { xs: 1, sm: 1.5 },
            boxSizing: "border-box",
            border: darkTheme ? "1px solid #394347" : "1px solid #dce2e5",
            borderRadius: 2,
            backgroundColor: darkTheme ? "#202628" : "#f7f9fa",
          }}
        >
          {showSeasonFilter && renderFilterSelect("Sezon", selectedSeason ?? "", event => setSelectedSeason?.(event.target.value), availableSeasons.map(season => ({ value: season, label: season })))}
          {showLeagueFilter && renderFilterSelect("Lig", leagueFilter ?? filters.league, event => {
            setLeagueFilter ? setLeagueFilter(event.target.value) : setFilters(current => ({ ...current, league: event.target.value }));
          }, teamLeagues.map(teamLeague => ({ value: teamLeague, label: teamLeague })))}
          {renderFilterSelect("Toplam korner", filters.corners, event => setFilters(current => ({ ...current, corners: event.target.value })), [
            { value: 7.5, label: "8+ korner" },
            { value: 8.5, label: "9+ korner" },
            { value: 9.5, label: "10+ korner" },
            { value: 10.5, label: "11+ korner" },
          ])}
          {renderFilterSelect("Korner üstünlüğü", filters.cornerWinner, event => setFilters(current => ({ ...current, cornerWinner: event.target.value })), [
            { value: "team", label: "Takım daha fazla" },
            { value: "opponent", label: "Rakip daha fazla" },
            { value: "draw", label: "Eşit korner" },
          ])}
          {renderFilterSelect("Gol filtresi", filters.goals, event => setFilters(current => ({ ...current, goals: event.target.value })), [
            { value: "over15", label: "1.5 Üst" },
            { value: "over25", label: "2.5 Üst" },
            { value: "over35", label: "3.5 Üst" },
            { value: "under25", label: "2.5 Alt" },
            { value: "btts", label: "Karşılıklı gol" },
          ])}
          {renderFilterSelect("Ceza skoru", filters.penaltyScore, event => setFilters(current => ({ ...current, penaltyScore: event.target.value })), [
            { value: 2.5, label: "2.5 Üst" },
            { value: 3.5, label: "3.5 Üst" },
            { value: 4.5, label: "4.5 Üst" },
          ])}
          {renderFilterSelect("Maç sonucu", filters.result, event => setFilters(current => ({ ...current, result: event.target.value })), [
            { value: "win", label: "Takım kazandı" },
            { value: "draw", label: "Beraberlik" },
            { value: "loss", label: "Takım kaybetti" },
          ])}
          {renderFilterSelect("İsabetli şut", filters.shotsOnTarget, event => setFilters(current => ({ ...current, shotsOnTarget: event.target.value })), [
            { value: 6, label: "6+ isabetli şut" },
            { value: 8, label: "8+ isabetli şut" },
            { value: 10, label: "10+ isabetli şut" },
          ])}
          <FormControlLabel
            sx={{ m: 0, minHeight: 40, color: darkTheme ? "#e0e6e8" : "text.primary", "& .MuiCheckbox-root": { color: darkTheme ? "#8c9a9f" : undefined } }}
            control={<Checkbox checked={filters.hasRedCard} onChange={event => setFilters(current => ({ ...current, hasRedCard: event.target.checked }))} size="small" />}
            label="Kırmızı kart görülen"
          />
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" gap={1}>
          <Stack direction="row" alignItems="baseline" spacing={1.25}>
            <Typography variant="subtitle1" sx={{ color: darkTheme ? "#f4f5f5" : "text.primary", fontWeight: 700 }}>
              Maç filtreleri
            </Typography>
            <Typography variant="caption" sx={{ color: darkTheme ? "#aab5b9" : "text.secondary" }}>
              {matchesPassingAllFilters.length} / {playedMatchCount} oynanmış maç
            </Typography>
          </Stack>
          <Button
            size="small"
            disabled={isVisualFilterEmpty}
            onClick={resetFilters}
            sx={{
              minHeight: 34,
              px: 1,
              color: darkTheme ? "#a8e6dc" : "primary.main",
              textTransform: "none",
              "&.Mui-disabled": { color: darkTheme ? "#849297" : "#9ba5aa", opacity: 1 },
            }}
          >
            Filtreleri temizle
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={2} width="100%" alignItems="center">
      {matchesToDisplay.map((m, i) => {
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
              width: matchColumnWidth,
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
                width={36}
                height={36}
                style={{ objectFit: "contain" }}
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
                width={36}
                height={36}
                style={{ objectFit: "contain" }}
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

            {filteredMatches.length === 0 && (
              <Box sx={{ width: "100%", py: 4, textAlign: "center", color: darkTheme ? "#aab5b9" : "text.secondary" }}>
                <Typography variant="body2">Bu takım için fikstür bulunamadı.</Typography>
              </Box>
            )}

          </Stack>
          
        );
      })}
    </Stack>
  </Stack>
  );
};

export default TeamFixture;
