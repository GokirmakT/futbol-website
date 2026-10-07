import { useState, useRef } from "react";
import {
  Stack, Typography, Box, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  FormControl, Select, MenuItem, ListSubheader
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useData } from "../context/DataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getTeamLogo } from "../Components/teamLogos.js";
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
import SeasonFilter from "../Components/SeasonFilter.jsx";
import PageLoader from "../Components/LoadingPage.jsx";

const HOME_AWAY_TABLES = {
  over15: { Table: OverGoals15HomeAway, line: "1.5", type: "Üst" },
  over25: { Table: OverGoals25HomeAway, line: "2.5", type: "Üst" },
  over35: { Table: OverGoals35HomeAway, line: "3.5", type: "Üst" },
  over45: { Table: OverGoals45HomeAway, line: "4.5", type: "Üst" },
  under15: { Table: LessGoals15HomeAway, line: "1.5", type: "Alt" },
  under25: { Table: LessGoals25HomeAway, line: "2.5", type: "Alt" },
  under35: { Table: LessGoals35HomeAway, line: "3.5", type: "Alt" },
  under45: { Table: LessGoals45HomeAway, line: "4.5", type: "Alt" },
};

const STAT_TYPE_LABELS = {
  over: "Gol Üst İstatistikleri",
  under: "Gol Alt İstatistikleri",
  kg: "KG İstatistikleri",
  both: "Her Yarıda Gol Atar İstatistikleri",
  ...Object.fromEntries(
    Object.entries(HOME_AWAY_TABLES).map(([value, { line, type }]) => [
      value,
      `Gol ${type} ${line} Ev/Deplasman`,
    ]),
  ),
};

function Goals() {
  const { goalStats, isLoading, isLoadingGoals, selectedLeague, setSelectedLeague, error, goalsError, leagues, seasons, selectedSeason, setSelectedSeason } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [statType, setStatType] = useState("over"); // "over" veya "under"
  const inputRef = useRef(null);
  const [isLeaguePanelOpen, setIsLeaguePanelOpen] = useState(false);
  const homeAwayTable = HOME_AWAY_TABLES[statType];
  const SelectedHomeAwayTable = homeAwayTable?.Table;

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

  if (isLoading || isLoadingGoals) return <PageLoader label="Gol istatistikleri yükleniyor..." />;
  if (error || goalsError) return <div>Error loading goal statistics</div>;

  return (
    <Stack
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "#2a3b47",
        "& .MuiTableHead-root .MuiTableCell-root": {
          py: 1.5,
          fontSize: { xs: "13px", sm: "15px" },
        },
        "& .MuiTableBody-root .MuiTableCell-root": {
          py: 1.5,
          fontSize: { xs: "13px", sm: "15px" },
          fontWeight: 700,
          lineHeight: 1.4,
        },
        "& .MuiTableBody-root .MuiTableCell-root:first-of-type span": {
          fontSize: { xs: "15px", sm: "18px" },
          fontWeight: 700,
          lineHeight: 1.25,
        },
        "& .MuiTableBody-root .MuiTableCell-root img": {
          width: { xs: "28px !important", sm: "34px !important" },
          height: { xs: "28px !important", sm: "34px !important" },
          objectFit: "contain",
          flexShrink: 0,
        },
      }}
      spacing={3}
    >
      <Stack direction={'column'} alignItems="center" sx={{pt: 5}}>
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
            <Typography aria-hidden="true" sx={{ fontSize: { xs: 27, sm: 32 }, lineHeight: 1 }}>
              ⚽
            </Typography>
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
              Gol İstatistikleri
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                color: "#aeb9bf",
                fontSize: { xs: "12px", sm: "14px" },
                lineHeight: 1.45,
              }}
            >
              Takımların gol eğilimlerini lig ve sezona göre keşfet.
            </Typography>
          </Box>
        </Box>

        {/* Lig seçimi */}
        <Box sx={{ width: { xs: '100%', md: '70%', lg: '50%' } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", alignItems: "stretch" }}>
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

          <Box sx={{ mt: 2, px: 1.5 }}>
            <FormControl fullWidth>
              <Select
                id="goal-stat-type"
                value={statType}
                onChange={(event) => setStatType(event.target.value)}
                renderValue={(value) => (
                  <Box sx={{ textAlign: "left" }}>
                    <Typography variant="caption" sx={{ display: "block", color: "#aeb6b8", lineHeight: 1.4 }}>
                      İstatistik Türü
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#f4f5f5", lineHeight: 1.5 }}>
                      {STAT_TYPE_LABELS[value]}
                    </Typography>
                  </Box>
                )}
                sx={{
                  height: 64,
                  backgroundColor: "#171b1d",
                  color: "#f4f5f5",
                  borderRadius: "8px",
                  "& .MuiSelect-select": { py: 1, display: "flex", alignItems: "center" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#303638" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#626b6e" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#ff9800" },
                  "& .MuiSvgIcon-root": { color: "#f4f5f5" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 360,
                      overflowY: "auto",
                      backgroundColor: "#171b1d",
                      color: "#f4f5f5",
                      "& .MuiMenuItem-root:hover": { backgroundColor: "#303638" },
                      "& .MuiListSubheader-root": {
                        backgroundColor: "#171b1d",
                        color: "#ffb74d",
                        fontWeight: 700,
                      },
                      "& .Mui-selected": { backgroundColor: "#3b3022 !important" },
                    },
                  },
                }}
              >
                <MenuItem value="over">Gol Üst İstatistikleri</MenuItem>
                <MenuItem value="under">Gol Alt İstatistikleri</MenuItem>
                <MenuItem value="kg">KG İstatistikleri</MenuItem>
                <MenuItem value="both">Her Yarıda Gol Atar İstatistikleri</MenuItem>
                <ListSubheader>Ev / Deplasman Tabloları · Gol Üst</ListSubheader>
                <MenuItem value="over15">Gol Üst 1.5 Ev/Deplasman</MenuItem>
                <MenuItem value="over25">Gol Üst 2.5 Ev/Deplasman</MenuItem>
                <MenuItem value="over35">Gol Üst 3.5 Ev/Deplasman</MenuItem>
                <MenuItem value="over45">Gol Üst 4.5 Ev/Deplasman</MenuItem>
                <ListSubheader>Ev / Deplasman Tabloları · Gol Alt</ListSubheader>
                <MenuItem value="under15">Gol Alt 1.5 Ev/Deplasman</MenuItem>
                <MenuItem value="under25">Gol Alt 2.5 Ev/Deplasman</MenuItem>
                <MenuItem value="under35">Gol Alt 3.5 Ev/Deplasman</MenuItem>
                <MenuItem value="under45">Gol Alt 4.5 Ev/Deplasman</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {homeAwayTable ? (
          <>
            <Stack
              sx={{
                mt: "20px",
                display: selectedLeague ? "block" : "none",
                width: isMobile ? "100%" : "70%",
                backgroundColor: "#1d1d1d",
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
                {selectedLeague} – Takımların Maç Başına {homeAwayTable.line} Gol {homeAwayTable.type} İstatistikleri (Ev/Deplasman)
              </Typography>
            </Stack>
            <SelectedHomeAwayTable
              goalStats={goalStats}
              selectedLeague={selectedLeague}
              isMobile={isMobile}
              getTeamLogo={getTeamLogo}
              football={football}
              playedMatches={playedMatches}
              getBgColor={getBgColor}
            />
          </>
        ) : statType === "both" ? (
          <ScoreBothHalf goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} getTeamLogo={getTeamLogo} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
        ) : statType === "kg" ? (
          <KgGoalsTable goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} getTeamLogo={getTeamLogo} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
        ) : (
          <>
            <Stack
              sx={{
                mt: "20px",
                display: selectedLeague ? "block" : "none",
                width: isMobile ? "100%" : "70%",
                backgroundColor: "#1d1d1d",
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
                {selectedLeague} – Takımlarının Gol Eğilimleri {statType === "over" ? "Üst" : "Alt"} İstatistikleri Ve Maç Başına Gol Ortalamaları
              </Typography>
            </Stack>
            {statType === "over" ? (
              <OverGoalsTable goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} getTeamLogo={getTeamLogo} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
            ) : (
              <LessGoalsTable goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} getTeamLogo={getTeamLogo} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
            )}
            {selectedLeague && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent={isMobile ? "flex-start" : "center"}
                spacing={3}
                sx={{
                  backgroundColor: "#1d1d1d",
                  padding: "10px 0",
                  width: isMobile ? "100%" : "70%",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img src={playedMatches} alt="" style={{ width: 20, height: 20 }} />
                  <Typography sx={{ color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: "bold" }}>
                    : Oynanan Maç Sayısı
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img src={football} alt="" style={{ width: 20, height: 20 }} />
                  <Typography sx={{ color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: "bold" }}>
                    : Maç Başına Gol Ortalaması
                  </Typography>
                </Stack>
              </Stack>
            )}

            <Stack
              sx={{
                mt: "20px",
                display: selectedLeague ? "block" : "none",
                width: isMobile ? "100%" : "70%",
              }}
            >
              <Typography sx={{ color: "#ddd", fontSize: "14px", lineHeight: 1.6, mt: 2 }}>
                Bu tablo, ligdeki takımların maçlarında ortaya çıkan gol eğilimlerini detaylı şekilde gösterir.
                Her takım için toplam maç sayısı, maç başına çıkan ortalama gol miktarı ve gol baremlerinin
                gerçekleşme yüzdeleri sunulur. Ev/deplasman tablolarında bu oranlar takımın kendi sahası ve
                deplasman maçları için ayrı ayrı gösterilir.
              </Typography>
            </Stack>

          </>
        )}
      </Stack>
    </Stack>
  );
}

export default Goals;
