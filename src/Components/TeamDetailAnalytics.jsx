import { Box, Stack, Typography } from "@mui/material";

const colors = {
  panel: "#252a2c",
  border: "#39464c",
  text: "#f4f5f5",
  muted: "#aab7bc",
  track: "#39464c",
  green: "#a8e6dc",
  blue: "#a8e6dc",
  red: "#ef9a9a",
  yellow: "#f1d27a",
};

const SummaryCard = ({ label, value, detail, accent = colors.blue, icon }) => (
  <Box
    sx={{
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: 1.25,
      p: { xs: 1.25, sm: 1.5 },
      border: `1px solid ${colors.border}`,
      borderRadius: 1.5,
      backgroundColor: colors.panel,
    }}
  >
    {icon && (
      <Box
        aria-hidden="true"
        sx={{
          display: "grid",
          placeItems: "center",
          flex: "0 0 auto",
          width: 38,
          height: 38,
          borderRadius: "50%",
          color: accent,
          fontSize: "1.2rem",
          backgroundColor: `${accent}24`,
        }}
      >
        {icon}
      </Box>
    )}
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ color: colors.muted, fontSize: "0.7rem", lineHeight: 1.3 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.35,
          color: colors.text,
          fontSize: { xs: "1.05rem", sm: "1.2rem" },
          fontWeight: 800,
          lineHeight: 1.15,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
      {detail && (
        <Typography sx={{ mt: 0.4, color: colors.muted, fontSize: "0.65rem", lineHeight: 1.3 }}>
          {detail}
        </Typography>
      )}
    </Box>
  </Box>
);

const ProgressRow = ({ label, value, rate, detail, accent = colors.green, showBar = true }) => {
  const percentage = Math.max(0, Math.min(100, Number(rate) || 0));

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Typography sx={{ minWidth: 0, color: colors.text, fontSize: "0.75rem", fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography sx={{ flex: "0 0 auto", color: accent, fontSize: "0.7rem", fontWeight: 700 }}>
          {value ?? `${Math.round(percentage)}%`}
        </Typography>
      </Stack>
      {(showBar || detail) && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.6 }}>
          {detail && (
            <Typography sx={{ flex: "0 0 auto", color: colors.muted, fontSize: "0.62rem" }}>
              {detail}
            </Typography>
          )}
          {showBar && (
            <Box sx={{ flex: 1, minWidth: 24, height: 6, borderRadius: 99, backgroundColor: colors.track }}>
              <Box
                sx={{
                  width: `${percentage}%`,
                  height: "100%",
                  borderRadius: 99,
                  backgroundColor: accent,
                  transition: "width 250ms ease",
                }}
              />
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
};

const ComparisonMetric = ({ item }) => {
  const percentage = Math.max(0, Math.min(100, Number(item.rate) || 0));
  const showBar = item.showBar !== false && Number.isFinite(Number(item.rate));
  const accent = item.accent || colors.green;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          color: colors.muted,
          fontSize: "0.65rem",
          lineHeight: 1.25,
          overflowWrap: "anywhere",
        }}
      >
        {item.label}
      </Typography>
      <Typography
        sx={{
          mt: 0.25,
          fontSize: "0.8rem",
          fontWeight: 800,
          lineHeight: 1.15,
          overflowWrap: "anywhere",
          color: item.valueColor || accent,
        }}
      >
        {item.value}
      </Typography>
      {showBar && (
        <Box sx={{ mt: 0.55, width: "100%", height: 6, borderRadius: 99, backgroundColor: colors.track }}>
          <Box
            sx={{
              width: `${percentage}%`,
              height: "100%",
              borderRadius: 99,
              backgroundColor: accent,
              transition: "width 250ms ease",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

const Panel = ({ title, children, sx }) => (
  <Box
    sx={{
      minWidth: 0,
      p: { xs: 1.4, sm: 1.75 },
      border: `1px solid ${colors.border}`,
      borderRadius: 1.5,
      backgroundColor: colors.panel,
      ...sx,
    }}
  >
    <Typography sx={{ mb: 1.5, color: colors.text, fontSize: "0.85rem", fontWeight: 700 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const TeamDetailAnalytics = ({ summary, featured, distribution, comparison, emptyMessage }) => {
  if (!featured.total) {
    return (
      <Box
        sx={{
          p: 2,
          border: `1px solid ${colors.border}`,
          borderRadius: 1.5,
          color: colors.muted,
          backgroundColor: colors.panel,
        }}
      >
        {emptyMessage}
      </Box>
    );
  }

  const percentage = Math.max(0, Math.min(100, Math.round(featured.rate)));
  const ringColor = featured.accent || colors.green;

  return (
    <Stack spacing={1.25}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
          gap: 1,
        }}
      >
        {summary.map(item => <SummaryCard key={item.label} {...item} />)}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) minmax(0, 1.08fr) minmax(0, 1.12fr)" },
          gap: 1,
          alignItems: "stretch",
        }}
      >
        <Panel title={featured.title || "Öne çıkan istatistik"} sx={{ display: "flex", flexDirection: "column" }}>
          <Stack
            direction={{ xs: "column", sm: "row", lg: "column", xl: "row" }}
            alignItems="center"
            justifyContent="center"
            spacing={{ xs: 1.5, sm: 2, lg: 1.5, xl: 2 }}
            sx={{ flex: 1 }}
          >
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: { xs: 132, sm: 144 },
                height: { xs: 132, sm: 144 },
                flex: "0 0 auto",
                borderRadius: "50%",
                background: `conic-gradient(${ringColor} ${percentage}%, ${colors.track} ${percentage}% 100%)`,
              }}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: "78%",
                  height: "78%",
                  borderRadius: "50%",
                  textAlign: "center",
                  backgroundColor: colors.panel,
                }}
              >
                <Typography sx={{ color: colors.text, fontSize: "1.55rem", fontWeight: 800, lineHeight: 1 }}>
                  {percentage}%
                </Typography>
                <Typography sx={{ mt: 0.6, color: colors.text, fontSize: "0.75rem", fontWeight: 700 }}>
                  {featured.label}
                </Typography>
                <Typography sx={{ mt: 0.25, color: colors.muted, fontSize: "0.65rem" }}>
                  {featured.count} / {featured.total} maç
                </Typography>
              </Stack>
            </Box>
            <Box sx={{ minWidth: 0, textAlign: { xs: "center", sm: "left", lg: "center", xl: "left" } }}>
              <Typography sx={{ color: colors.text, fontSize: "0.9rem", fontWeight: 700 }}>
                {featured.label}
              </Typography>
              <Typography sx={{ mt: 0.5, color: colors.muted, fontSize: "0.7rem", lineHeight: 1.5 }}>
                {featured.detail}
              </Typography>
            </Box>
          </Stack>
        </Panel>

        <Panel title="Diğer istatistikler">
          <Stack spacing={1.35}>
            {distribution.map(item => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={`${Math.round(item.rate)}%`}
                rate={item.rate}
                detail={`${item.count} / ${item.total} maç`}
                accent={item.accent || colors.blue}
              />
            ))}
          </Stack>
        </Panel>

        <Panel
          title="İç saha & deplasman karşılaştırması"
          sx={{ display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
              gap: { xs: 1.25, sm: 1 },
              flex: 1,
            }}
          >
            {comparison.map((side, index) => (
              <Box
                key={side.label}
                sx={{
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  pl: index ? { xs: 0, sm: 1 } : 0,
                  borderLeft: index ? { xs: "none", sm: `1px solid ${colors.border}` } : "none",
                  borderTop: index ? { xs: `1px solid ${colors.border}`, sm: "none" } : "none",
                  pt: index ? { xs: 1.25, sm: 0 } : 0,
                  pb: index ? 0 : { xs: 1.25, sm: 0 },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={0.65} sx={{ mb: 1 }}>
                  <Box
                    component="img"
                    src={index === 0 ? "/home.png" : "/plane.png"}
                    alt=""
                    aria-hidden="true"
                    sx={{ width: 24, height: 24, objectFit: "contain", flexShrink: 0, filter: "brightness(0) invert(1)" }}
                  />
                  <Typography sx={{ minWidth: 0, color: colors.text, fontSize: "0.7rem", fontWeight: 700, overflowWrap: "anywhere" }}>
                    {side.label} · {side.matches} maç
                  </Typography>
                </Stack>
                <Stack spacing={1} sx={{ flex: 1, justifyContent: "space-between" }}>
                  {side.metrics.map(item => (
                    <Box key={item.label} sx={{ flex: 1, display: "flex", minHeight: 0 }}>
                      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <ComparisonMetric item={item} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>
        </Panel>
      </Box>
    </Stack>
  );
};

export default TeamDetailAnalytics;
