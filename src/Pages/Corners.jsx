import { useState, useMemo, useRef } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  const [isLeaguePanelOpen, setIsLeaguePanelOpen] = useState(false);


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

                    {/* Autocomplete yerine buton + panel */}
          <Box sx={{ mt: 4, px: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              ref={inputRef}
              onClick={() => {
                setIsLeaguePanelOpen(true);
                toggleBodyScroll(true);
              }}
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                backgroundColor: "#fff",
                borderColor: "#ccc",
                borderRadius: 1,
                py: 1.1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  borderColor: "#bbb",
                },
              }}
            >
              {selectedLeague && (
                <img
                  src={`/leagues/${selectedLeague}.png`}
                  width={24}
                  height={24}
                  style={{ marginRight: 8, borderRadius: "4px" }}
                  alt={selectedLeague}
                />
              )}
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="caption" sx={{ display: "block", color: "#888" }}>
                  Lig Seç
                </Typography>
                <Typography variant="body1" sx={{ color: "#222" }}>
                  {selectedLeague || "Lig seçmek için tıklayın"}
                </Typography>
              </Box>
            </Button>
          </Box>

          {/* Lig seçim paneli */}
          {isLeaguePanelOpen && (
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                zIndex: 1300,
                backgroundColor: "rgba(0,0,0,0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                setIsLeaguePanelOpen(false);
                toggleBodyScroll(false);
              }}
            >
              <Paper
                sx={{
                  maxWidth: 700,
                  width: "92%",
                  maxHeight: "80vh",
                  backgroundColor: "#1d1d1d",
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 2,
                }}
                onClick={e => e.stopPropagation()}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Lig Seçimi
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setIsLeaguePanelOpen(false);
                      toggleBodyScroll(false);
                    }}
                    sx={{ color: "#fff" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>

                <Typography variant="body2" color="grey.400" mb={2}>
                  Oynamak istediğin ligi seçmek için kartlara tıkla.
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
                    gap: 1.5,
                    maxHeight: "60vh",
                    overflowY: "auto",
                    pr: 0.5,
                  }}
                >
                  {leagueOptions.map(option => (
                    <Paper
                      key={option.label}
                      onClick={() => {
                        setSelectedLeague(option.label);
                        setIsLeaguePanelOpen(false);
                        toggleBodyScroll(false);
                      }}
                      sx={{
                        cursor: "pointer",
                        backgroundColor:
                          option.label === selectedLeague ? "#ff9800" : "#ffffff",
                        borderRadius: 1.5,
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.7)",
                          backgroundColor:
                            option.label === selectedLeague ? "#ffa726" : "#344955",
                        },
                      }}
                    >
                      <img
                        src={option.icon}
                        width={64}
                        height={64}
                        alt={option.label}
                        style={{ marginBottom: 6 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: option.label === selectedLeague ? "bold" : "normal",
                        }}
                      >
                        {option.label}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Box>
          )}
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
