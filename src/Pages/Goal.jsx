import { useState, useRef } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { useData } from "../context/DataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { teamLogos } from "../Components/teamLogos.js";
import playedMatches from "/white-soccer-field.png";
import football from "/football.png";
import OverGoalsTable from "../Components/Tables/GoalTables/OverGoalsTable";
import OverGoals15HomeAway from "../Components/Tables/GoalTables/OverGoals15HomeAwayTable";
import OverGoals25HomeAway from "../Components/Tables/GoalTables/OverGoals25HomeAwayTable";
import OverGoals35HomeAway from "../Components/Tables/GoalTables/OverGoals35HomeAwayTable";
import OverGoals45HomeAway from "../Components/Tables/GoalTables/OverGoals45HomeAwayTable";

import LessGoalsTable from "../Components/Tables/GoalTables/LessGoalsTable";
import LessGoals15HomeAway from "../Components/Tables/GoalTables/LessGoals15HomeAwayTable";
import LessGoals25HomeAway from "../Components/Tables/GoalTables/LessGoals25HomeAwayTable";
import LessGoals35HomeAway from "../Components/Tables/GoalTables/LessGoals35HomeAwayTable";
import LessGoals45HomeAway from "../Components/Tables/GoalTables/LessGoals45HomeAwayTable";

import KgGoalsTable from "../Components/Tables/GoalTables/KgGoalsTable";
import ScoreBothHalf from "../Components/Tables/GoalTables/ScoreBothHalf";

function Goals() {
  const { goalStats, isLoading, selectedLeague, setSelectedLeague, error, leagues } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [statType, setStatType] = useState("over"); // "over" veya "under"
  const inputRef = useRef(null);

  const getBgColor = (percent) => {
    if (percent <= 20) return "#ff4d4d";      // kırmızı
    if (percent <= 40) return "#ff944d";      // turuncu
    if (percent <= 60) return "#ffd11a";      // sarı
    if (percent <= 80) return "#b3ff66";      // açık yeşil
    return "#66ff66";                         // yeşil
    };

  const leagueOptions = leagues.map(l => ({
    label: l,
    icon: `/leagues/${l}.png` // örn: public/leagues/Super Lig.png
  }));

  const toggleBodyScroll = (lock) => {
  document.body.style.overflow = lock ? "hidden" : "auto";
};

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", background: "#2a3b47"}} spacing={3}>
      <Stack direction={'column'} alignItems="center" sx={{pt: 5}}>

        {/* Lig seçimi */}
        <Box sx={{ width: '70%' }} justifyContent="center" alignItems="center" direction={{ xs: 'column', md: 'row' }}>
          <Typography textAlign="center" variant="h5" sx={{ color: "#fff", fontWeight: "bold"}}>
            Gol İstatistikleri
          </Typography>

          <Autocomplete
            options={leagueOptions}
            value={leagueOptions.find(l => l.label === selectedLeague) || null}
            onOpen={() => toggleBodyScroll(true)}
            onClose={() => toggleBodyScroll(false)}
            onChange={(event, val) => {
              setSelectedLeague(val?.label || null);

              // 📱 mobilde klavyeyi kapat
              setTimeout(() => {
                inputRef.current?.blur();
              }, 0);
            }}
            blurOnSelect
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(opt, val) => opt.label === val.label}

            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <img src={option.icon} width={20} height={20} />
                {option.label}
              </Box>
            )}

            renderInput={(params) => (
              <TextField
                {...params}
                label="Lig Seç"
                inputRef={inputRef}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: selectedLeague && (
                    <img
                      src={`/leagues/${selectedLeague}.png`}
                      width={20}
                      height={20}
                      style={{ marginRight: 8 }}
                    />
                  )
                }}
              />
            )}

            sx={{
              mt: 4,
              pl: 1.5,
              pr: 1.5,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff"
              }
            }}
          />

          {/* --- BUTONLAR BURADA --- */}
          <Stack direction={isMobile ? 'column' : 'row'}
            sx={{
              display: "flex",
              gap: 1,
              mt: 3,
              width: "100%",
              justifyContent: "center"              
            }}
          >
            {/* Gol Üst */}
            <Button
              variant="contained"
              onClick={() => setStatType("over")}
              sx={{
                backgroundColor: statType === "over" ? "#ff9800" : "#444",
                color: "#fff",
                fontWeight: "bold",
                fontSize: isMobile ? "12px" : "16px",
                px: 2,
                "&:hover": {
                  backgroundColor: statType === "over" ? "#ffa726" : "#555"
                }
              }}
            >
              Gol Üst İstatistikleri
            </Button>

            {/* Gol Alt */}
            <Button
              variant="contained"
              onClick={() => setStatType("under")}
              sx={{
                backgroundColor: statType === "under" ? "#ff9800" : "#444",
                color: "#fff",
                fontWeight: "bold",
                fontSize: isMobile ? "12px" : "16px",
                px: 2,
                "&:hover": {
                  backgroundColor: statType === "under" ? "#ffa726" : "#555"
                }
              }}
            >
              Gol Alt İstatistikleri
            </Button>

            <Button
              variant="contained"
              onClick={() => setStatType("kg")}
              sx={{
                backgroundColor: statType === "kg" ? "#ff9800" : "#444",
                color: "#fff",
                fontWeight: "bold",
                fontSize: isMobile ? "12px" : "16px",
                px: 2,
                "&:hover": {
                  backgroundColor: statType === "kg" ? "#ffa726" : "#555"
                }
              }}
            >
              KG İstatistikleri
            </Button>

            <Button
              variant="contained"
              onClick={() => setStatType("both")}
              sx={{
                backgroundColor: statType === "both" ? "#ff9800" : "#444",
                color: "#fff",
                fontWeight: "bold",
                fontSize: isMobile ? "12px" : "16px",
                px: 2,
                "&:hover": {
                  backgroundColor: statType === "both" ? "#ffa726" : "#555"
                }
              }}
            >
              Her Yarıda Gol Atar İstatistikleri
            </Button>
          </Stack>
        </Box>

        {statType === "both" ? (
          <ScoreBothHalf goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
        ) : 

        statType === "kg" ? (
          <KgGoalsTable goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
        ) : (

          <>

            <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
            <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
                {selectedLeague} – Takımlarının Gol Eğilimleri {statType === "over" ? "Üst" : "Alt"} İstatistikleri Ve Maç Başına Gol Ortalamaları
            </Typography>
          </Stack> 

          {statType === "over" ? (
            <OverGoalsTable goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
          ) : (
            <LessGoalsTable goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
          )}

          {/* Tablo Altı İkon + Yazı */}
          {selectedLeague && (
            <Stack
                direction="row"
                alignItems="center" 
                justifyContent= {isMobile ? "flex-start" : "center"}
                spacing={3}
                sx={{             
                  backgroundColor: "#1d1d1d",
                  padding: "10px 0",              
                  width: isMobile ? '100%' : '70%'             
                }}>
                  
                {/* 1. ikon + yazı */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img src={playedMatches} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20 }} />
                  <Typography sx={{ color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: "bold" }}>
                    : Oynanan Maç Sayısı
                  </Typography>
                </Stack>

                {/* 2. ikon + yazı */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img src={football} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20 }} />
                  <Typography sx={{ color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: "bold" }}>
                    : Maç Başına Gol Ortalaması
                  </Typography>
                </Stack>
              </Stack> 
              
              )}


        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%'}}>
        
            <Typography
              variant="body1"
              sx={{
                color: "#ddd",
                fontSize: "14px",
                lineHeight: 1.6,
                mt: 2              
              }}
            >
              Bu tablo, ligdeki takımların maçlarında ortaya çıkan gol eğilimlerini detaylı şekilde gösterir. 
              Her takım için toplam maç sayısı, maç başına çıkan ortalama gol miktarı ve maçlarının hangi sıklıkla 
              2.5, 3.5 ve 4.5 üst bittiği yüzdesel olarak sunulmuştur. Böylece bir takımın maçlarının genel olarak 
              gollü mü yoksa düşük skorlu mu geçtiğini kolayca görebilirsiniz.<br/><br/>

              Tablo, hangi takımların gol açısından daha istikrarlı veya riskli olduğunu tek 
              bakışta anlamanıza yardımcı olur. Bu tablo, gol analizleri, tahmin çalışmaları veya maç eğilimlerini 
              anlamak için sade ve güçlü bir özet sunar.
            </Typography>

        </Stack>
      

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
            {selectedLeague} – Takımların Maç Başına 2.5 {statType === "over" ? "Üst" : "Alt"} Gol İstatistikleri (Ev/Deplasman)
          </Typography>
        </Stack>     

        {/* Takımların Maç Başına Gol 2.5 Üst İstatistikleri */}
        {statType === "over" ? (
            <OverGoals25HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
          ) : (
            <LessGoals25HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
          )}
        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
            {selectedLeague} – Takımların Maç Başına 1.5 {statType === "over" ? "Üst" : "Alt"} Gol İstatistikleri (Ev/Deplasman)
          </Typography>
        </Stack>     

        {/* Takımların Maç Başına Gol 2.5 Üst İstatistikleri */}
        {statType === "over" ? (
            <OverGoals15HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
          ) : (
            <LessGoals15HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
          )}
        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
            {selectedLeague} – Takımların Maç Başına 3.5 {statType === "over" ? "Üst" : "Alt"} Gol İstatistikleri (Ev/Deplasman)
          </Typography>
        </Stack>

        {statType === "over" ? (
            <OverGoals35HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
          ) : (
            <LessGoals35HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
          )}
        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
            {selectedLeague} – Takımların Maç Başına 4.5 {statType === "over" ? "Üst" : "Alt"} Gol İstatistikleri (Ev/Deplasman)
          </Typography>
        </Stack>

        {statType === "over" ? (
            <OverGoals45HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
          ) : (
            <LessGoals45HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
          )}          
          
          </>         
        )}
      </Stack>
    </Stack>
  );
}

export default Goals;
