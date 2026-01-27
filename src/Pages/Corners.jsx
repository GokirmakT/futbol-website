import { useState, useMemo, useRef } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { useData } from "../context/DataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getTeamLogo } from "../Components/teamLogos.js";
import playedMatches from "/white-soccer-field.png";
import football from "/football.png";
import corner from "/corner.png";

import OverCornersTable from "../Components/Tables/CornerTables/OverCornersTable";
import OverHomeCornersTable from "../Components/Tables/CornerTables/OverHomeCornersTable";
import OverHomeCornersTable2 from "../Components/Tables/CornerTables/OverHomeCornersTable2";

function Corner() {
  const { cornerStats, isLoading, selectedLeague, setSelectedLeague, error, leagues } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");
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
  document.body.style.overflow = lock ? "hidden" : "auto";};

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", background: "#2a3b47"}} spacing={3}>
      <Stack direction={'column'} alignItems="center" sx={{pt: 5}}>

        {/* Lig Seçimi */}
        <Box sx={{ width: { xs: '100%', md: '300px' } }} justifyContent="center" alignItems="center" direction={{ xs: 'column', md: 'row' }}>
            <Typography textAlign="center" variant="h5" sx={{ color: "#fff", fontWeight: "bold"}}>
            Korner İstatistikleri
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
        </Box>

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
              {selectedLeague} – Takımların Maç Başına Korner (Üst) İstatistikleri
          </Typography>
        </Stack> 

        <OverCornersTable cornerStats={cornerStats} selectedLeague={selectedLeague} isMobile={isMobile} getTeamLogo={getTeamLogo} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>    

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
            </Stack> 
            
            )}    

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
              {selectedLeague} – Takımların Maç Başına Korner (Üst) İstatistikleri
          </Typography>
        </Stack> 
        
        <OverHomeCornersTable cornerStats={cornerStats} selectedLeague={selectedLeague} isMobile={isMobile} getTeamLogo={getTeamLogo} corner={corner} playedMatches={playedMatches} getBgColor={getBgColor}/>        
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
                <img src={corner} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20 }} />
                <Typography sx={{ color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: "bold" }}>
                  : Ortalama Kullandığı Korner Sayısı
                </Typography>
              </Stack>              
            </Stack> 
            
            )}    

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
              {selectedLeague} – Takımların Maç Başına Korner (Üst) İstatistikleri
          </Typography>
        </Stack>     

        <OverHomeCornersTable2 cornerStats={cornerStats} selectedLeague={selectedLeague} isMobile={isMobile} getTeamLogo={getTeamLogo} corner={corner} playedMatches={playedMatches} getBgColor={getBgColor}/>        
      </Stack>
    </Stack>
  );
}

export default Corner;
