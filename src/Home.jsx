import { useState } from 'react';
import { Stack, Typography, Grid, Button, Paper, Box } from '@mui/material';
import { useQuery } from "@tanstack/react-query";
import { getMatches } from "./api/api";

function Home() {

  const [step, setStep] = useState(1);

  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  // ⭐ Week 1 filtreleme (hook DEĞİL — güvenli)
  const week1Matches = Array.isArray(matches) ? matches.filter(m => m.week === 1) : [];

  return (
    <Stack sx={{width: "100%", minHeight: "100vh", background: "#b48181ff"}} alignItems="center" >
      
    </Stack>
  );
}

export default Home;
