import { useState } from 'react';
import { Stack, Typography, Grid, Button, Paper, Box } from '@mui/material';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function Home() {

  const [step, setStep] = useState(1);

  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5017/api/matches");
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  // ⭐ Week 1 filtreleme (hook DEĞİL — güvenli)
  const week1Matches = matches.filter(m => m.week === 1);

  return (
    <Stack sx={{width: "100%", minHeight: "100vh", background: "#b48181ff"}} alignItems="center" >
      
    </Stack>
  );
}

export default Home;
