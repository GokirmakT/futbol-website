import { useState, useMemo } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";


const OverCards = ({ cardStats, seasonMatches, selectedLeague, isMobile, getTeamLogo, card, playedMatches, getBgColor }) => {  

    const navigate = useNavigate();

    /* 🔽 SORT STATE */
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("RedOver05Rate");

    /* 🔁 SORT HANDLER */
    const handleSort = (property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };

    const redRatesByTeam = useMemo(() => {
      const teamStats = new Map();

      seasonMatches
        .filter(match => match.league === selectedLeague && match.winner !== "TBD")
        .forEach(match => {
          const totalRedCards = (Number(match.redHome) || 0) + (Number(match.redAway) || 0);

          [match.homeTeam, match.awayTeam].forEach(team => {
            if (!team) return;
            if (!teamStats.has(team)) {
              teamStats.set(team, { matches: 0, over05: 0, over15: 0, over25: 0 });
            }

            const stats = teamStats.get(team);
            stats.matches++;
            if (totalRedCards > 0.5) stats.over05++;
            if (totalRedCards > 1.5) stats.over15++;
            if (totalRedCards > 2.5) stats.over25++;
          });
        });

      return new Map([...teamStats].map(([team, stats]) => [team, {
        RedOver05Rate: (stats.over05 / stats.matches) * 100,
        RedOver15Rate: (stats.over15 / stats.matches) * 100,
        RedOver25Rate: (stats.over25 / stats.matches) * 100,
      }]));
    }, [seasonMatches, selectedLeague]);

    /* 🧠 SORTED DATA */
    const sortedRows = useMemo(() => {
      return cardStats.map(row => ({ ...row, ...redRatesByTeam.get(row.team) })).sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
        return 0;
      });
    }, [cardStats, redRatesByTeam, order, orderBy]);

    /* 🎯 SORTABLE HEADER CELL */
    const SortHeader = ({ label, field, abc, align = "center" }) => (
        <TableCell align={align}
          onClick={() => handleSort(field)}
          sx={{
            pr: isMobile ? 1 : 2,
            pl: isMobile ? 0 : 2,
            color: "#fff",
            fontWeight: "bold",          
            flexDirection: "column",   // 🔥 ÜST-ALT
            alignItems: "center",
            cursor: "pointer",
            "& .MuiTableSortLabel-icon": {
              margin: 0,
              color: "#fff !important"
            }
          }}  
      >
        {abc}     
      </TableCell>
    );  

    return (
        <>
          {selectedLeague && cardStats.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              width: isMobile ? '100%' : '70%',              
              backgroundColor: "#2a3b47",
              overflow: 'hidden',
              borderRadius: 0             
            }}
          >
            <Table size="small" stickyHeader sx={{borderRadius: 0}}>
              <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#1d1d1d" } }}>
                <TableRow>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 2 : 2, pl: isMobile ? 0 : 2 }}>Takım</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2  }} align="center">
                  <Stack alignItems={'center'}>
                    <img
                      src={playedMatches}
                      style={{ width: 20, height: 20, color: "#fff" }}
                    />    
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">
                  <Stack alignItems={'center'}>
                    <img
                      src={card}
                      style={{ width: 20, height: 20, color: "#fff", filter: "invert(1)" }}
                    />    
                    </Stack>
                  </TableCell>
                  <SortHeader align="center" field="RedOver05Rate" abc="0.5 Üst"></SortHeader>
                  <SortHeader align="center" field="RedOver15Rate" abc="1.5 Üst"></SortHeader>
                  <SortHeader align="center" field="RedOver25Rate" abc="2.5 Üst"></SortHeader>
                </TableRow>
              </TableHead>

              <TableBody>
                {sortedRows.map(row => (
                  <TableRow key={row.team} sx={{ "&:hover": { backgroundColor: "#2c2c2c" } }}>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontSize: '12px',
                        pr: isMobile ? 2 : 2, pl: isMobile ? 1 : 2,
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#90caf9"
                        }
                      }}
                      onClick={() =>
                        navigate(`/team/${selectedLeague}/${row.team}`)
                      }
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <img
                          src={getTeamLogo(row.team)}
                          alt={row.team}
                          style={{ width: 22, height: 22 }}
                        />
                        <span>{row.team}</span>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">{row.matchCount}</TableCell>
                    <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">{row.totalRedCards}</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(Number(row.RedOver05Rate ?? 0)), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{Number(row.RedOver05Rate ?? 0).toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(Number(row.RedOver15Rate ?? 0)), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{Number(row.RedOver15Rate ?? 0).toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(Number(row.RedOver25Rate ?? 0)), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{Number(row.RedOver25Rate ?? 0).toFixed(0)}%</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        </>
      );
    }

export default OverCards;
