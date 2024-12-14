import React, { useEffect, useState } from "react"
import { Alert, Snackbar, Button, TextField } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { FormControl, InputLabel, Select, Box, MenuItem } from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Norms () {
    const [rows, setRows] = useState([])
    const [devID, setDevID] = useState([])
    const [update, setUpdate] = useState(0)
    const [slctID, setSlctID] = useState('')
    const [deviceID, setDeviceID] = useState('')
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlert] = useState('info')
    const [showAddDialog, setAddDialog] = useState(false)
    const [showEditDialog, setEditDialog] = useState(false)
    const [showDeleteDialog, setDeleteDialog] = useState(false)

    function Velector() {
        return (
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel>ID</InputLabel>
                <Select
                  value={deviceID}
                  label="ID"
                  onChange={(e) => {setDeviceID(e.target.value)}}
                >
                  {devID.map((row) => {
                    return <MenuItem value={row.ID}>{row.ID}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Box>
          );
    }

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
            const response = await fetch('http://localhost:8080/norms',{
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
            console.log("Rows", data)
            setRows(data);
            notify("Norms are loaded", 'success')
            
            const response1 = await fetch('http://localhost:8080/devices_ids', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    "token" : `${localStorage.getItem("token")}`,
                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                },
            });

            if (response1.status !== 200){
                notify("Can't get devices ids", 'error')
                return
            }

            const data1 = await response1.json();
            setDevID(data1)
        }) ()
    }, [update]);

    const handleOpenAddDialog = () => {
        setAddDialog(true)
    }

    const handleCloseAddDialog = () => {
        setAddDialog(false)
    }

    const handleOpenEditDialog = () => {
        setEditDialog(true)
    }

    const handleCloseEditDialog = () => {
        setEditDialog(false)
    }

    const handleOpenDeleteDialog = () => {
        setDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialog(false)
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Maximum value</TableCell>
                        <TableCell align="center">Allowable value</TableCell>
                        <TableCell align="center">Device ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                    <TableRow
                    key={row.ID}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center">{row.ID}</TableCell>
                        <TableCell align="center">{row.Max_value}</TableCell>
                        <TableCell align="center">{row.Allowable_value}</TableCell>
                        <TableCell align="center">{row.Device_id}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={alertType}>{message}</Alert>
            </Snackbar>

                    {/* ADD */}
            <React.Fragment>
                <Button onClick={handleOpenAddDialog} variant="outlined" sx={{margin:"10px", color:'black', borderColor:'black'}}>Add new norm</Button>
                <Dialog
                open={showAddDialog}
                onClose={handleCloseAddDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const max_value = parseInt(formJson.max_value, 10);
                        const allowable_value = parseInt(formJson.allowable_value, 10);
                        
                        (async () => {
                            const response = await fetch('http://localhost:8080/add_norm', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "token" : `${localStorage.getItem("token")}`,
                                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                                },
                                body: JSON.stringify({
                                    max_value : max_value,
                                    allowable_value : allowable_value,
                                    device_id : deviceID
                                })
                            })

                            if (response.status > 300) {
                                notify("Could not add new norm", 'error');
                                handleCloseAddDialog();
                            }

                            notify("New norm added", "success");
                            handleCloseAddDialog();
                            setUpdate(update+1);
                        }) ()
                    },
                }}
                >
                <DialogTitle>Add new norm</DialogTitle>
                <DialogContent>
                    <TextField name='max_value' label='`Maximum value' variant="outlined" fullWidth sx={{margin:'5px'}} ></TextField>
                    <TextField name='allowable_value' label='Allowable value' variant="outlined" sx={{margin:'5px'}} fullWidth></TextField>
                    <Velector />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
                </Dialog>
            </React.Fragment>

                    {/* EDIT */}
            <React.Fragment>
                <Button onClick={handleOpenEditDialog} variant="outlined" sx={{margin:"10px", color:'black', borderColor:'black'}}>Edit existing norm</Button>
                <Dialog
                open={showEditDialog}
                onClose={handleCloseEditDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const max_value = parseInt(formJson.max_value, 10);
                        const allowable_value = parseInt(formJson.allowable_value, 10);
                        
                        (async () => {
                            const response = await fetch(`http://localhost:8080/edit_norm/${slctID}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "token" : `${localStorage.getItem("token")}`,
                                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                                },
                                body: JSON.stringify({
                                    max_value : max_value,
                                    allowable_value : allowable_value,
                                    device_id : deviceID
                                })
                            })

                            if (response.status > 300) {
                                notify("Could not edit norm", 'error');
                                handleCloseEditDialog();
                                return
                            }

                            notify("Norm is changed", "success");
                            handleCloseEditDialog();
                            setUpdate(update+1);
                        }) ()
                    },
                }}
                >
                <DialogTitle>Edit norm</DialogTitle>
                <DialogContent>
                    <TextField name='max_value' label='`Maximum value' variant="outlined" fullWidth sx={{margin:'5px'}} ></TextField>
                    <TextField name='allowable_value' label='Allowable value' variant="outlined" sx={{margin:'5px'}} fullWidth></TextField>
                    <Velector />
                    <Gelector />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Cancel</Button>
                    <Button type="submit">Edit</Button>
                </DialogActions>
                </Dialog>
            </React.Fragment>
                    {/* DELETE */}
            <React.Fragment>
                <Button onClick={handleOpenDeleteDialog} variant="outlined" sx={{margin:"10px", color:'black', borderColor:'black'}}>Delete existing norm</Button>
                <Dialog
                open={showDeleteDialog}
                onClose={handleCloseDeleteDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        (async () => {
                            const response = await fetch(`http://localhost:8080/delete_norm/${slctID}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "token" : `${localStorage.getItem("token")}`,
                                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                                }
                            })

                            if (response.status > 300) {
                                notify("Could not delete norm", 'error');
                                handleCloseDeleteDialog();
                            }

                            notify("Norm deleted", "success");
                            handleCloseDeleteDialog();
                            setUpdate(update+1);
                        }) ()
                    },
                }}
                >
                <DialogTitle>Delete norm</DialogTitle>
                <DialogContent>
                    <Gelector />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button type="submit">Delete</Button>
                </DialogActions>
                </Dialog>
            </React.Fragment>
            
        </div>
    )
}

export default Norms