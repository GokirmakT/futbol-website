import { Stack, Box, Typography, Divider, TextField, Select, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { teamLogos } from "../Components/TeamLogos";
import corner from "/corner.png";
import redCard from "/cards.png";
import shoot from "/kicking-ball.png";
import shootOnTarget from "/shoot-on-target.png";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useState } from "react";

const TeamFixture = ({ matches, team }) => {
  const navigate = useNavigate();
  const isTablet = useMediaQuery("(max-width: 800px)");
  const isMobile = useMediaQuery("(max-width: 500px)");
  const { selectedLeague } = useData();

  const [filters, setFilters] = useState({
    shots: null,          // 10 | 15 | 20
    shotsOnTarget: null,  // 5 | 8
    corners: null,        // 7 | 9 | 11
    cornerWinner: null,   // "home" | "away"    
    penaltyScore: null,   // 3 | 4 | 5
    hasRedCard: false,
    result: null,         // "home" | "away" | "draw"
    goals: null           // "over25" | "over35"
  });
  

  const checkMatchFilters = (m, f) => {
    if (f.corners && (m.cornerHome + m.cornerAway) < f.corners) return false;
  
    if (f.cornerWinner === "home" && m.cornerHome <= m.cornerAway) return false;
    if (f.cornerWinner === "away" && m.cornerAway <= m.cornerHome) return false;
  
    if (f.hasRedCard && (m.redHome + m.redAway) === 0) return false;

    if (f.penaltyScore && ((m.yellowHome + (m.redHome * 2)) + (m.yellowAway + (m.redAway * 2 )))  < f.penaltyScore) return false;
  
    return true;
  };
  
  
  const getBgColor = (team, homeTeam, homeGoal, awayGoal) => {
    const isHome = team === homeTeam;
  
    // BERABERLİK
    if (homeGoal === awayGoal) {
      return "#ffd11a"; // sarı
    }
  
    // EV SAHİBİ
    if (isHome) {
      return homeGoal > awayGoal ? "#66ff66" : "#ff4d4d";
    }
  
    // DEPLASMAN
    return awayGoal > homeGoal ? "#66ff66" : "#ff4d4d";
  };  

  return (
    <Stack spacing={2} alignItems="center">
      
      <Stack direction="column" spacing={1} justifyContent="flex-end">

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

    <Stack spacing={2} width="100%" alignItems="center">
      {matches.map((m, i) => {
        const isPlayed = m.winner !== "TBD";  
        
        const passes = isPlayed && checkMatchFilters(m, filters);

        const isFilterEmpty = Object.values(filters).every(
          v => v === null || v === false
        );

        return (
          <Stack
            key={i}
            sx={{
              borderRadius: 2,
              backgroundColor: !isPlayed
                ? "#e3f2fd"           // oynanmamış maç
                : isFilterEmpty
                ? "#f5f5f5"           // 🟦 filtre YOKSA (normal renk)
                : passes
                ? "#a7faa7"           // 🟩 filtre VAR + koşul sağlandı
                : "#fdecea",          // 🟥 filtre VAR + koşul sağlanmadı
              px: 1,
              py: 1,
              width: isTablet ? "95%" : "60%"
            }}
            
          >
            {/* TARİH */}
            <Stack width="100%" direction="row" justifyContent="space-between">
                <Typography
                    variant="caption"
                    color="text.secondary"
                    textAlign="right"
                 >
                    {m.league}
                 </Typography>

                 <Typography
                    variant="caption"
                    color="text.secondary"
                    textAlign="right"
                 >
                    {new Date(m.date).toLocaleDateString("tr-TR")}
                 </Typography>
            </Stack>
           
          
            {/* GRID ROW */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto minmax(0,1fr) 48px minmax(0,1fr) auto",
                alignItems: "center",
                columnGap: 1
              }}
            >
              {/* HOME LOGO */}
              <img
                src={teamLogos[m.homeTeam]}
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
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.main"
                  }
                }}
                title={m.homeTeam}
                textAlign="left"
                onClick={() =>
                        navigate(`/team/${selectedLeague}/${m.homeTeam}`)
                      }
              >
                {m.homeTeam}
              </Typography>
          
              {/* SCORE */}
              <Stack bgcolor={getBgColor(team, m.homeTeam, m.goalHome, m.goalAway)}>
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
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.main"
                  }
                }}                
                title={m.awayTeam}
                textAlign="right"
                 onClick={() =>
                        navigate(`/team/${selectedLeague}/${m.awayTeam}`)
                      }
              >
                {m.awayTeam}
              </Typography>
          
              {/* AWAY LOGO */}
              <img
                src={teamLogos[m.awayTeam]}
                alt={m.awayTeam}
                width={28}
                height={28}                
              />
            </Box>

            {/* İSTATİSTİKLER */}
            {isPlayed && (
                <Stack direction="row" justifyContent="space-between" spacing={4} mt={2}>

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
                                <img src={redCard} alt={corner} width={24} height={24}/>
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
                                borderColor: "#ccc",
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
                                <img src={redCard} alt={corner} width={24} height={24}/>
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
