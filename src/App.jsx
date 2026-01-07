import { Route, Routes } from "react-router-dom";
import Header from "./Components/Header.jsx";
import Home from "./Home.jsx";
import Card from "./Pages/Card.jsx";
import Corners from "./Pages/Corners.jsx";
import Goal from "./Pages/Goal.jsx";
import TodayMatches from "./Pages/TodayMatches.jsx";
import Standings from "./Pages/Standings.jsx";
import Statistics from "./Pages/Statistics.jsx";
import TeamDetail from "./Pages/TeamDetail.jsx";

export default function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<TodayMatches />} /> 
        <Route path="/TodayMatches" element={<TodayMatches />} />  
        <Route path="/lig/:leagueId" element={<Standings />} />
        <Route path="/Cards" element={<Card />} />   
        <Route path="/Corners" element={<Corners />} />
        <Route path="/Goals" element={<Goal />} />
        <Route path="/Statistics" element={<Statistics />} />
        <Route path="/team/:league/:team" element={<TeamDetail />} />

      </Routes>
    </>
  );
}