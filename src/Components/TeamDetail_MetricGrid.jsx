import { Box, Typography } from "@mui/material";

export const MetricCard = ({ label, value, detail, accent = "#a8e6dc" }) => (
  <Box sx={{ minWidth: 0, p: 1.5, border: "1px solid #39464c", borderRadius: 1, backgroundColor: "#202a30" }}>
    <Typography variant="caption" sx={{ display: "block", color: "#aab7bc", lineHeight: 1.35 }}>
      {label}
    </Typography>
    <Typography sx={{ mt: 0.5, color: accent, fontSize: { xs: "1.05rem", sm: "1.2rem" }, fontWeight: 800, lineHeight: 1.2, overflowWrap: "anywhere" }}>
      {value}
    </Typography>
    {detail && (
      <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "#87969c", lineHeight: 1.35 }}>
        {detail}
      </Typography>
    )}
  </Box>
);

const MetricGrid = ({ items, columns = { xs: 2, sm: 3, lg: 4 } }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: `repeat(${columns.xs}, minmax(0, 1fr))`, sm: `repeat(${columns.sm}, minmax(0, 1fr))`, lg: `repeat(${columns.lg}, minmax(0, 1fr))` }, gap: 1 }}>
    {items.map(item => <MetricCard key={item.label} {...item} />)}
  </Box>
);

export default MetricGrid;