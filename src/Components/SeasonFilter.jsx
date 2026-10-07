import { Box, Typography, Select, MenuItem } from "@mui/material";

function SeasonFilter({ seasons = [], selectedSeason, setSelectedSeason, sx = {}, dark = false }) {
  if (!seasons.length) return null;

  return (
    <Box sx={{ mt: 2, ...sx }}>
      {!dark && (
        <Typography variant="caption" sx={{ display: "block", color: "#888", mb: 0.5 }}>
          Sezon Seç
        </Typography>
      )}
      <Select
        fullWidth
        value={selectedSeason ?? ""}
        onChange={e => setSelectedSeason(e.target.value)}
        renderValue={dark ? (season) => (
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="caption" sx={{ display: "block", color: "#aeb6b8", lineHeight: 1.4 }}>
              Sezon Seç
            </Typography>
            <Typography variant="body1" sx={{ color: "#f4f5f5", lineHeight: 1.5 }}>
              {season}
            </Typography>
          </Box>
        ) : undefined}
        sx={{
          height: dark ? 64 : undefined,
          backgroundColor: dark ? "#171b1d" : "#fff",
          color: dark ? "#f4f5f5" : undefined,
          borderRadius: dark ? "8px" : 1,
          "& .MuiSelect-select": dark ? { py: 1, display: "flex", alignItems: "center" } : undefined,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: dark ? "#303638" : undefined,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: dark ? "#626b6e" : undefined,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: dark ? "#ff9800" : undefined,
          },
          "& .MuiSvgIcon-root": { color: dark ? "#f4f5f5" : undefined },
        }}
        MenuProps={dark ? {
          PaperProps: {
            sx: {
              backgroundColor: "#171b1d",
              color: "#f4f5f5",
              "& .MuiMenuItem-root:hover": { backgroundColor: "#303638" },
              "& .Mui-selected": { backgroundColor: "#3b3022 !important" },
            },
          },
        } : undefined}
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
