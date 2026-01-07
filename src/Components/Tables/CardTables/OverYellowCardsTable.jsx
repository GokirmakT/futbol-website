import { useState, useMemo } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";


const OverCards = ({ cardStats, selectedLeague, isMobile, teamLogos, card, playedMatches, getBgColor }) => {  
    const navigate = useNavigate();

    /* 🔽 SORT STATE */
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("over25Rate");

    /* 🔁 SORT HANDLER */
    const handleSort = (property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };

    /* 🧠 SORTED DATA */
    const sortedRows = useMemo(() => {
      return [...cardStats].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
        return 0;
      });
    }, [cardStats, order, orderBy]);

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
                  <SortHeader align="center" field="over25Rate" abc="2.5 Üst"></SortHeader>
                  <SortHeader align="center" field="over35Rate" abc="3.5 Üst"></SortHeader>
                  <SortHeader align="center" field="over45Rate" abc="4.5 Üst"></SortHeader>
                  <SortHeader align="center" field="over55Rate" abc="5.5 Üst"></SortHeader>
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
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.over25Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.over25Rate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.over35Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.over35Rate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.over45Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.over45Rate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.over55Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.over55Rate.toFixed(0)}%</TableCell>
                    
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
