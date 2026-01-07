import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Box,
  Grid
} from "@mui/material";
import { useData } from "../context/DataContext";

// 🔽 ALT BİLEŞENLER
const GoalsStats = ({ matches, team, goalStats }) => {
  // Seçili takımın goalStats'ını bul
  const teamStats = goalStats.find(stat => stat.team === team);

  if (!teamStats) {
    return (
      <Stack spacing={1}>
        <Typography>Maç Sayısı: {matches.length}</Typography>
        <Typography variant="body2" color="text.secondary">
          İstatistikler yükleniyor...
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Genel İstatistikler
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Oynanan Maç</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {teamStats.matchCount}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Maç Başına Gol Ortalaması</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {teamStats.avgMatchGoals.toFixed(2)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Attığı Gol</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {teamStats.goalsFor}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Yediği Gol</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {teamStats.goalsAgainst}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3 }}>
        Over/Under İstatistikleri
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, backgroundColor: "#e3f2fd", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Over 1.5</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              %{teamStats.over15Rate.toFixed(1)}
            </Typography>
            <Typography variant="caption">
              ({teamStats.over15Count}/{teamStats.matchCount})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, backgroundColor: "#e8f5e9", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Over 2.5</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#388e3c" }}>
              %{teamStats.over25Rate.toFixed(1)}
            </Typography>
            <Typography variant="caption">
              ({teamStats.over25Count}/{teamStats.matchCount})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, backgroundColor: "#fff3e0", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Over 3.5</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#f57c00" }}>
              %{teamStats.over35Rate.toFixed(1)}
            </Typography>
            <Typography variant="caption">
              ({teamStats.over35Count}/{teamStats.matchCount})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, backgroundColor: "#fce4ec", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Over 4.5</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#c2185b" }}>
              %{teamStats.over45Rate.toFixed(1)}
            </Typography>
            <Typography variant="caption">
              ({teamStats.over45Count}/{teamStats.matchCount})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, backgroundColor: "#f3e5f5", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Under 1.5</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#7b1fa2" }}>
              %{teamStats.less15Rate.toFixed(1)}
            </Typography>
            <Typography variant="caption">
              ({teamStats.less15Count}/{teamStats.matchCount})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, backgroundColor: "#e0f2f1", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Under 2.5</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#00796b" }}>
              %{teamStats.less25Rate.toFixed(1)}
            </Typography>
            <Typography variant="caption">
              ({teamStats.less25Count}/{teamStats.matchCount})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, backgroundColor: "#fff8e1", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Under 3.5</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#f9a825" }}>
              %{teamStats.less35Rate.toFixed(1)}
            </Typography>
            <Typography variant="caption">
              ({teamStats.less35Count}/{teamStats.matchCount})
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, backgroundColor: "#f1f8e9", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">Under 4.5</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#689f38" }}>
              %{teamStats.less45Rate.toFixed(1)}
            </Typography>
            <Typography variant="caption">
              ({teamStats.less45Count}/{teamStats.matchCount})
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3 }}>
        Ev/Deplasman İstatistikleri
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, backgroundColor: "#e3f2fd", borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Ev Sahibi
            </Typography>
            <Typography variant="body2">Maç: {teamStats.homeMatchCount}</Typography>
            <Typography variant="body2">Over 2.5: %{teamStats.homeOver25Rate.toFixed(1)}</Typography>
            <Typography variant="body2">Over 3.5: %{teamStats.homeOver35Rate.toFixed(1)}</Typography>
            <Typography variant="body2">BTS: %{teamStats.homeBtsRate.toFixed(1)}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, backgroundColor: "#fff3e0", borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Deplasman
            </Typography>
            <Typography variant="body2">Maç: {teamStats.awayMatchCount}</Typography>
            <Typography variant="body2">Over 2.5: %{teamStats.awayOver25Rate.toFixed(1)}</Typography>
            <Typography variant="body2">Over 3.5: %{teamStats.awayOver35Rate.toFixed(1)}</Typography>
            <Typography variant="body2">BTS: %{teamStats.awayBtsRate.toFixed(1)}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 2, mt: 2 }}>
        <Typography variant="body2" color="text.secondary">Both Teams to Score (BTS)</Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          %{teamStats.btsRate.toFixed(1)}
        </Typography>
        <Typography variant="caption">
          ({teamStats.bts}/{teamStats.matchCount} maçta her iki takım da gol attı)
        </Typography>
      </Box>
    </Stack>
  );
};

export default GoalsStats;