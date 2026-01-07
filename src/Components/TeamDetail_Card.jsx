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
import GoalsStats from "../Components/TeamDetail_Goal.jsx";

const CardStats = ({ matches }) => {
  return (
    <Stack spacing={1}>
      <Typography>Maç Sayısı: {matches.length}</Typography>
      <Typography variant="body2" color="text.secondary">
        (Buraya: kart istatistikleri gelecek)
      </Typography>
    </Stack>
  );
};

export default CardStats;