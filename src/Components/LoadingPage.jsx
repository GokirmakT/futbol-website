import { CircularProgress, Box } from "@mui/material";

export default function PageLoader() {
  return (
    <Box
      sx={{
        height: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <CircularProgress />
    </Box>
  );
}
