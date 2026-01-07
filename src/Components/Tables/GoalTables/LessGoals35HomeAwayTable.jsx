import { useState, useMemo } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const OverGoals = ({ goalStats, selectedLeague, isMobile, teamLogos, football, playedMatches, getBgColor }) => {  

    const navigate = useNavigate();

      /* 🔽 SORT STATE */
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("less35Rate");

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
  const SortHeader = ({ label, field, abc, align = "center" }) => (
    <TableCell align={align} 
        active={orderBy === field}
        direction={orderBy === field ? order : "asc"}
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
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 2 : 2, pl: isMobile ? 0 : 2 }}>Takım</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2  }} align="center">
                  <Stack alignItems={'center'}>
                    <img
                      src={playedMatches}
                      style={{ width: 20, height: 20, color: "#fff" }}
                    />    
                    </Stack>
                  </TableCell>
                  
                  <SortHeader align="center" field="less35Rate" abc="3.5 Alt"></SortHeader>
                  <SortHeader align="center" field="homeLess35Rate" abc="İç Saha"></SortHeader>
                  <SortHeader align="center" field="awayLess35Rate" abc="Dış Saha"></SortHeader>
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
                          src={teamLogos[row.team]}
                          alt={row.team}
                          style={{ width: 22, height: 22 }}
                        />
                        <span>{row.team}</span>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">{row.matchCount}</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.less35Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.less35Rate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.homeLess35Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.homeLess35Rate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.awayLess35Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.awayLess35Rate.toFixed(0)}%</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        </>
      );
    }

export default OverGoals;
