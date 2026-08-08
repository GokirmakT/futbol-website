import { Box, Typography, Select, MenuItem } from "@mui/material";

function SeasonFilter({ seasons = [], selectedSeason, setSelectedSeason, sx = {} }) {
  if (!seasons.length) return null;

  return (
    <Box sx={{ mt: 2, ...sx }}>
      <Typography variant="caption" sx={{ display: "block", color: "#888", mb: 0.5 }}>
        Sezon Seç
      </Typography>
      <Select
        size="small"
        fullWidth
        value={selectedSeason ?? ""}
        onChange={e => setSelectedSeason(e.target.value)}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
        }}
      >
        {seasons.map(season => (
          <MenuItem key={season} value={season}>
            {season}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

export default SeasonFilter;
