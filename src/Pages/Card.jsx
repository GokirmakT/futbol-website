import { useState, useRef } from 'react';
import { Stack, Typography, Box, Autocomplete, TextField, Button, Table, TableBody, TableCell, IconButton, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useData } from "../context/DataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import { getTeamLogo } from "../Components/teamLogos.js";
import playedMatches from "/white-soccer-field.png";
import card from "/yellow-card.png";
import OverYellowCardsTable from '../Components/Tables/CardTables/OverYellowCardsTable';
import OverRedCardsTable from '../Components/Tables/CardTables/OverRedCardsTable';
import OverPenaltyScoreTable from '../Components/Tables/CardTables/OverPenaltyScoreTable';
import SeasonFilter from "../Components/SeasonFilter.jsx";
import PageLoader from "../Components/LoadingPage.jsx";

function Card() {
  const { cardStats, seasonMatches, isLoading, isLoadingCards, selectedLeague, setSelectedLeague, error, cardsError, leagues, seasons, selectedSeason, setSelectedSeason } = useData();
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

  if (isLoading || isLoadingCards) return <PageLoader label="Kart istatistikleri yükleniyor..." />;
  if (error || cardsError) return <div>Error loading card statistics</div>;

  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", background: "#2a3b47"}} spacing={3}>
      <Stack direction="column" alignItems="center" sx={{ pt: 5 }}>
        <Box
          sx={{
            width: { xs: "calc(100% - 24px)", md: "70%", lg: "50%" },
            boxSizing: "border-box",
            mb: 1,
            px: { xs: 2, sm: 2.5 },
            py: { xs: 2, sm: 2.5 },
            display: "flex",
            alignItems: "center",
            gap: 2,
            border: "1px solid rgba(255, 152, 0, 0.24)",
            borderRadius: 2,
            background: "linear-gradient(115deg, #202d35 0%, #172127 68%, #29251f 100%)",
            boxShadow: "0 10px 28px rgba(0, 0, 0, 0.16)",
          }}
        >
          <Box
            sx={{
              width: { xs: 46, sm: 54 },
              height: { xs: 46, sm: 54 },
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 1.5,
              color: "#ffb74d",
              backgroundColor: "rgba(255, 152, 0, 0.13)",
              border: "1px solid rgba(255, 183, 77, 0.2)",
            }}
          >
            <Box
              component="img"
              src={card}
              alt=""
              sx={{
                width: { xs: 25, sm: 30 },
                height: { xs: 32, sm: 38 },
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: { xs: "19px", sm: "24px" },
                lineHeight: 1.2,
                letterSpacing: "0.01em",
              }}
            >
              Kart İstatistikleri
            </Typography>
            <Typography sx={{ mt: 0.5, color: "#aeb9bf", fontSize: { xs: "12px", sm: "14px" }, lineHeight: 1.45 }}>
              Takımların kart eğilimlerini lig ve sezona göre keşfet.
            </Typography>
          </Box>
        </Box>

        {/* Lig seçimi */}
        <Box sx={{ width: { xs: "100%", md: "70%", lg: "50%" } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", alignItems: "stretch" }}>
          {/* Autocomplete yerine buton + panel */}
          <Box sx={{ mt: 2, px: 1.5, minWidth: 0 }}>
            <Button
              fullWidth
              variant="outlined"
              ref={inputRef}
              onClick={() => {
                setIsLeaguePanelOpen(true);
                toggleBodyScroll(true);
              }}
              sx={{
                minWidth: 0,
                height: 64,
                justifyContent: "flex-start",
                textTransform: "none",
                backgroundColor: "#171b1d",
                borderColor: "#303638",
                borderRadius: "8px",
                color: "#f4f5f5",
                py: 1.1,
                "&:hover": {
                  backgroundColor: "#222729",
                  borderColor: "#626b6e",
                },
              }}
            >
              {selectedLeague && (
                <img
                  src={`/leagues/${selectedLeague}.png`}
                  width={32}
                  height={32}
                  style={{ marginRight: 8, borderRadius: "4px", flexShrink: 0 }}
                  alt={selectedLeague}
                />
              )}
              <Box sx={{ textAlign: "left", minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ display: "block", color: "#aeb6b8", lineHeight: 1.4 }}>
                  Lig Seç
                </Typography>
                <Typography
                  variant="body1"
                  noWrap
                  title={selectedLeague || "Lig seçmek için tıklayın"}
                  sx={{ color: "#f4f5f5", lineHeight: 1.5 }}
                >
                  {selectedLeague || "Lig seçmek için tıklayın"}
                </Typography>
              </Box>
            </Button>
          </Box>

          <SeasonFilter
            seasons={seasons}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
            dark
            sx={{ mt: 2, px: 1.5, minWidth: 0 }}
          />
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
                  backgroundColor: "#171b1d",
                  color: "#f4f5f5",
                  border: "1px solid #303638",
                  borderRadius: "8px",
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
                        backgroundColor: option.label === selectedLeague ? "#1976d2" : "#fff",
                        color: option.label === selectedLeague ? "#fff" : "#263238",
                        border: "1px solid",
                        borderColor: option.label === selectedLeague ? "#1976d2" : "#e1e5e7",
                        borderRadius: "8px",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
                          borderColor: option.label === selectedLeague ? "#1976d2" : "#c6ced1",
                          backgroundColor: option.label === selectedLeague ? "#1565c0" : "#f1f4f5",
                          color: option.label === selectedLeague ? "#fff" : "#263238",
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
                          color: "inherit",
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
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold"}}>
              {selectedLeague} – Takımlarının Maçların Çıkan Sarı Kart Üst Yüzdeleri
          </Typography>
        </Stack> 

        {/* Tablo */}
        <OverYellowCardsTable cardStats={cardStats} selectedLeague={selectedLeague} isMobile={isMobile} getTeamLogo={getTeamLogo} card={card} playedMatches={playedMatches} getBgColor={getBgColor}/>        
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
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold"}}>
              {selectedLeague} – Takımlarının Maçların Çıkan Kırmızı Kart Üst Yüzdeleri
          </Typography>
        </Stack>      

        <OverRedCardsTable cardStats={cardStats} seasonMatches={seasonMatches} selectedLeague={selectedLeague} isMobile={isMobile} getTeamLogo={getTeamLogo} card={card} playedMatches={playedMatches} getBgColor={getBgColor}/>        
        
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
                <img src={card} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20, filter: "invert(1)"}} />
                <Typography sx={{ color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: "bold" }}>
                  : Gördüğü Toplam Kırmızı Kart Sayısı
                </Typography>
              </Stack>              
            </Stack> 
            
            )}

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold"}}>
              {selectedLeague} – Takımlarının Maçlarda Kart Ceza Skorları Üst Yüzdeleri
          </Typography>
        </Stack>      

        <OverPenaltyScoreTable cardStats={cardStats} selectedLeague={selectedLeague} isMobile={isMobile} getTeamLogo={getTeamLogo} card={card} playedMatches={playedMatches} getBgColor={getBgColor}/>        
                  

      </Stack>

      {selectedLeague && cardStats.length === 0 && (
        <Typography sx={{ color: "#fff", mt: 3 }}>
          Bu ligde veri bulunmamaktadır.
        </Typography>
      )}
    </Stack>
  );
}

export default Card;
