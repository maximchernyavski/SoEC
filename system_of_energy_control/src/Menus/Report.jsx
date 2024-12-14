import React, { useEffect, useState } from "react"
import { Alert, Snackbar, Button } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { FormControl, InputLabel, Select, Box, MenuItem } from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Report () {
    const [rows, setRows] = useState([])
    const [update, setUpdate] = useState(0)
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlert] = useState('info')
    const [slctID, setSlctID] = useState('')
    const [showDeleteDialog, setDeleteDialog] = useState(false)
    const [showGetDialog, setGetDialog] = useState(false)

    function Gelector() {
        return (
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel>ID</InputLabel>
                <Select
                  value={slctID}
                  label="ID"
                  onChange={(e) => {setSlctID(e.target.value)}}
                >
                  {rows.map((row) => {
                    return <MenuItem value={row.ID}>{row.ID}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Box>
          );
    }

    function notify(messageText, typeOfAlert) {
        setOpen(true)
        setMessage(messageText)
        setAlert(typeOfAlert)
    }

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    useEffect(() => {
        (async () => {
            const response = await fetch('http://localhost:8080/reports',{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    "token" : `${localStorage.getItem("token")}`,
                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                },
            });

            if (response.status !== 200){
                notify("Can't get table data", 'error')
                return
            }

            const data = await response.json();
            setRows(data);
            notify("Reports are loaded", 'success')
            return
        }) ()
    }, [update]);

    const handleOpenDeleteDialog = () => {
        setDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialog(false)
    }
    
    const handleOpenGetDialog = () => {
        setGetDialog(true)
    }

    const handleCloseGetDialog = () => {
        setGetDialog(false)
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Header</TableCell>
                        <TableCell align="center">Body</TableCell>
                        <TableCell align="center">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                    <TableRow
                    key={row.ID}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center">{row.ID}</TableCell>
                        <TableCell align="center">{row.Header}</TableCell>
                        <TableCell align="center">{row.Body}</TableCell>
                        <TableCell align="center">{row.Date.slice(0, 9)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={alertType}>{message}</Alert>
            </Snackbar>

            <React.Fragment>
                <Button onClick={handleOpenDeleteDialog} variant="outlined" sx={{margin:"10px", color:'black', borderColor:'black'}}>Delete existing report</Button>
                <Dialog
                open={showDeleteDialog}
                onClose={handleCloseDeleteDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        (async () => {
                            const response = await fetch(`http://localhost:8080/delete_report/${slctID}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "token" : `${localStorage.getItem("token")}`,
                                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                                }
                            })

                            if (response.status > 300) {
                                notify("Could not delete report", 'error');
                                handleCloseDeleteDialog();
                            }

                            notify("Report deleted", "success");
                            handleCloseDeleteDialog();
                            setUpdate(update+1);
                        }) ()
                    },
                }}
                >
                <DialogTitle>Delete report</DialogTitle>
                <DialogContent>
                    <Gelector />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button type="submit">Delete</Button>
                </DialogActions>
                </Dialog>
            </React.Fragment>

                {/* GET */}
            <React.Fragment>
                <Button onClick={handleOpenGetDialog} variant="outlined" sx={{margin:"10px", color:'black', borderColor:'black'}}>Get existing report</Button>
                <Dialog
                open={showGetDialog}
                onClose={handleCloseGetDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        (async () => {
                            const response = await fetch(`http://localhost:8080/serve_report/${slctID}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "token" : `${localStorage.getItem("token")}`,
                                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                                }
                            })

                            if (response.status > 300) {
                                notify("Could not delete report", 'error');
                                handleCloseGetDialog();
                            }

                            notify("Report served", "success");
                            handleCloseGetDialog();
                        }) ()
                    },
                }}
                >
                <DialogTitle>Get report</DialogTitle>
                <DialogContent>
                    <Gelector />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseGetDialog}>Cancel</Button>
                    <Button type="submit">Get</Button>
                </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    )
}

export default Report