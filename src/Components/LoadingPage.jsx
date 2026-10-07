import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

export default function PageLoader({ label = "Yükleniyor..." }) {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack
        alignItems="center"
        spacing={2}
        sx={{
          px: 4,
          py: 3.5,
          borderRadius: 3,
          background: "linear-gradient(145deg, rgba(23, 27, 29, 0.94), rgba(35, 51, 59, 0.9))",
          border: "1px solid rgba(94, 234, 212, 0.18)",
          boxShadow: "0 14px 45px rgba(0, 0, 0, 0.22)",
        }}
      >
        <Box sx={{ position: "relative", display: "inline-flex", color: "#5eead4" }}>
          <CircularProgress
            size={58}
            thickness={3.5}
            sx={{
              color: "#5eead4",
              "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "#f4f5f5",
            }}
          >
            <SportsSoccerIcon sx={{ fontSize: 25 }} />
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "#c2cccf", fontWeight: 600, letterSpacing: 0.2 }}
        >
          {label}
        </Typography>
      </Stack>
    </Box>
  );
}
