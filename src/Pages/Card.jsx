import { useState, useMemo } from 'react';
import { Stack, Typography, Box, Autocomplete, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useData } from "../context/DataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { teamLogos } from "../Components/TeamLogos";
import playedMatches from "/white-soccer-field.png";
import football from "/football.png";
import card from "/yellow-card.png";
import OverYellowCardsTable from '../Components/Tables/CardTables/OverYellowCardsTable';
import OverRedCardsTable from '../Components/Tables/CardTables/OverRedCardsTable';
import OverPenaltyScoreTable from '../Components/Tables/CardTables/OverPenaltyScoreTable';

function Card() {
  const { cardStats, isLoading, selectedLeague, setSelectedLeague, error, leagues } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const getBgColor = (percent) => {
    if (percent <= 20) return "#ff4d4d";      // kırmızı
    if (percent <= 40) return "#ff944d";      // turuncu
    if (percent <= 60) return "#ffd11a";      // sarı
    if (percent <= 80) return "#b3ff66";      // açık yeşil
    return "#66ff66";                         // yeşil
    };  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", background: "#2a3b47"}} spacing={3}>
      <Stack direction={'column'} alignItems="center" sx={{pt: 5}}>        
        {/* Lig Seçimi */}
        <Box sx={{ width: { xs: '100%', md: '300px' } }} justifyContent="center" alignItems="center" direction={{ xs: 'column', md: 'row' }}>
            <Typography textAlign="center" variant="h5" sx={{ color: "#fff", fontWeight: "bold"}}>
                Takım Kart Sıralaması
            </Typography>
          <Autocomplete
            options={leagues}
            value={selectedLeague}
            onChange={(event, newValue) => setSelectedLeague(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Lig Seç" placeholder="Bir lig seçin..." />
            )}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff"
              }, mt: 4, pl: 1.5, pr: 1.5
            }}
          />
        </Box>

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold"}}>
              {selectedLeague} – Takımlarının Maçların Çıkan Sarı Kart Üst Yüzdeleri
          </Typography>
        </Stack> 

        {/* Tablo */}
        <OverYellowCardsTable cardStats={cardStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} card={card} playedMatches={playedMatches} getBgColor={getBgColor}/>        
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

        <OverRedCardsTable cardStats={cardStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} card={card} playedMatches={playedMatches} getBgColor={getBgColor}/>        
        
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

        <OverPenaltyScoreTable cardStats={cardStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} card={card} playedMatches={playedMatches} getBgColor={getBgColor}/>        
                  

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
