import { useState, useMemo } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import home from "/home.png";
import plane from "/plane.png";
import { useNavigate } from "react-router-dom";

const KgGoals = ({ goalStats, selectedLeague, isMobile, teamLogos, football, playedMatches, getBgColor }) => {  

    const navigate = useNavigate();

      /* 🔽 SORT STATE */
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("bothHalvesRate");

    /* 🔁 SORT HANDLER */
    const handleSort = (property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };

    /* 🧠 SORTED DATA */
    const sortedRows = useMemo(() => {
      return [...goalStats].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
        return 0;
      });
    }, [goalStats, order, orderBy]);

    /* 🎯 SORTABLE HEADER CELL */
    const SortHeader = ({ label, field, abc, align = "center" }) => {
      const isImage =
        typeof abc === "string" &&
        (abc.startsWith("/") || abc.startsWith("http"));
    
      return (
        <TableCell
          align={align}
          onClick={() => handleSort(field)}
          sx={{
            pr: isMobile ? 1 : 2,
            pl: isMobile ? 0 : 2,
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          <Stack
            direction="column"
            alignItems="center"
            spacing={0.5}
          >
            
            {!isImage && (
              <span>{abc}</span>
            )}    
           
            {isImage && (
              <img
                src={abc}
                alt=""
                style={{ width: 20, height: 20 }}
              />
            )}
          </Stack>
        </TableCell>
      );
    };
    

    return (
        <>
           <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
               <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
                   {selectedLeague} – Takımlarının Her iki Devrede Gol Atma İstatistikleri
               </Typography>
           </Stack> 

          {selectedLeague && goalStats.length > 0 && (
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
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 0 : 0, pl: isMobile ? 0 : 2 }}>Takım</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2  }} align="center">
                  <Stack alignItems={'center'}>
                    <img
                      src={playedMatches}
                      style={{ width: 20, height: 20, color: "#fff" }}
                    />    
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                    <Stack alignItems={'center'}>
                    <img
                      src={football}
                      style={{ width: 20, height: 20, color: "#fff" }}
                    />    
                    </Stack>
                  </TableCell>
                  <SortHeader align="center" field="bothHalvesRate" abc="Score"></SortHeader>
                  <SortHeader align="center" field="homeBothHalvesRate" abc={home}></SortHeader>
                  <SortHeader align="center" field="awayBothHalvesRate" abc={plane}></SortHeader>
                </TableRow>
              </TableHead>

              <TableBody>
                {sortedRows.map(row => (
                  <TableRow key={row.team} sx={{ "&:hover": { backgroundColor: "#2c2c2c" } }}>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontSize: '12px',
                        pr: isMobile ? 2 : 2, pl: isMobile ?1 : 2,
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
                          src={teamLogos[row.team]}
                          alt={row.team}
                          style={{ width: 22, height: 22 }}
                        />
                        <span>{row.team}</span>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">{row.matchCount}</TableCell>
                    <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">{row.avgMatchGoals.toFixed(2)}</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.bothHalvesRate), pr: isMobile ? 1 : 2, pl: isMobile ? 1 : 2}}>{row.bothHalvesRate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.homeBothHalvesRate), pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}}>{row.homeBothHalvesRate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.awayBothHalvesRate), pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}}>{row.awayBothHalvesRate.toFixed(0)}%</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        </>
      );
    }

export default KgGoals;
