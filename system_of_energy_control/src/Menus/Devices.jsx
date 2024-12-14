import React, { useEffect, useState } from "react"
import { Alert, Snackbar, Button, TextField, Switch, FormControlLabel } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { FormControl, InputLabel, Select, Box, MenuItem } from "@mui/material"
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Devices () {
    const [rows, setRows] = useState([])
    const [update, setUpdate] = useState(0)
    const [newDate, setNewDate] = useState(dayjs())
    const [newState, setNewState] = useState(false)
    const [editDate, setEditDate] = useState(dayjs())
    const [editState, setEditState] = useState(false)
    const [slctID, setSlctID] = useState('')
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlert] = useState('info')
    const [showAddDialog, setAddDialog] = useState(false)
    const [showEditDialog, setEditDialog] = useState(false)
    const [showDeleteDialog, setDeleteDialog] = useState(false)

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
            const response = await fetch('http://localhost:8080/devices',{
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
            notify("Devices are loaded", 'success')
            return
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
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Settings</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="center">State</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                    <TableRow
                    key={row.ID}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center">{row.ID}</TableCell>
                        <TableCell align="center">{row.Name}</TableCell>
                        <TableCell align="center">{row.Settings}</TableCell>
                        <TableCell align="center">{row.Date}</TableCell>
                        <TableCell align="center">{row.Type}</TableCell>
                        <TableCell align="center">{row.State ? "online" : "offline"}</TableCell>
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
                <Button onClick={handleOpenAddDialog} variant="outlined" sx={{margin:"10px", color:'black', borderColor:'black'}}>Add new device</Button>
                <Dialog
                open={showAddDialog}
                onClose={handleCloseAddDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const name = formJson.name;
                        const settings = formJson.settings;
                        const type = formJson.type;
                        
                        (async () => {
                            const response = await fetch('http://localhost:8080/add_device', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "token" : `${localStorage.getItem("token")}`,
                                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                                },
                                body: JSON.stringify({
                                    name : `${name}`,
                                    settings : `${settings}`,
                                    date : newDate.format("YYYY-MM-DD"),
                                    type : `${type}`,
                                    state: newState
                                })
                            })

                            if (response.status > 300) {
                                notify("Could not add new device", 'error');
                                handleCloseAddDialog();
                            }

                            notify("New device added", "success");
                            handleCloseAddDialog();
                            setUpdate(update+1);
                        }) ()
                    },
                }}
                >
                <DialogTitle>Add new device</DialogTitle>
                <DialogContent>
                    <TextField name='name' label='Device name' variant="outlined" fullWidth sx={{margin:'5px'}}></TextField>
                    <TextField name='settings' label='Device settings' variant="outlined" sx={{margin:'5px'}} fullWidth></TextField>
                    <LocalizationProvider dateAdapter={AdapterDayjs}><DatePicker value={newDate} onChange={(newValue) => {setNewDate(newValue)}} format="YYYY-MM-DD" label="Device date" sx={{margin:'5px'}} /></LocalizationProvider>
                    <TextField name='type' label='Device type' variant="outlined" sx={{margin:'5px'}} fullWidth></TextField>
                    <FormControlLabel control={<Switch checked={newState} onChange={(e) => {setNewState(e.target.checked)}}/>} label="Device state" sx={{margin:'5px'}} ></FormControlLabel>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
                </Dialog>
            </React.Fragment>

                    {/* EDIT */}
            <React.Fragment>
                <Button onClick={handleOpenEditDialog} variant="outlined" sx={{margin:"10px", color:'black', borderColor:'black'}}>Edit existing device</Button>
                <Dialog
                open={showEditDialog}
                onClose={handleCloseEditDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const name = formJson.name;
                        const settings = formJson.settings;
                        const type = formJson.type;
                        
                        (async () => {
                            const response = await fetch(`http://localhost:8080/edit_device/${slctID}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "token" : `${localStorage.getItem("token")}`,
                                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                                },
                                body: JSON.stringify({
                                    name : `${name}`,
                                    settings : `${settings}`,
                                    date : editDate.format("YYYY-MM-DD"),
                                    type : `${type}`,
                                    state: editState
                                })
                            })

                            if (response.status > 300) {
                                notify("Could not edit device", 'error');
                                handleCloseEditDialog();
                                return
                            }

                            notify("Device is changed", "success");
                            handleCloseEditDialog();
                            setUpdate(update+1);
                        }) ()
                    },
                }}
                >
                <DialogTitle>Edit device</DialogTitle>
                <DialogContent>
                    <TextField name='name' label='Device name' variant="outlined" fullWidth sx={{margin:'5px'}}></TextField>
                    <TextField name='settings' label='Device settings' variant="outlined" sx={{margin:'5px'}} fullWidth></TextField>
                    <LocalizationProvider dateAdapter={AdapterDayjs}><DatePicker value={editDate} onChange={(newValue) => {setEditDate(newValue)}} format="YYYY-MM-DD" label="Device date" sx={{margin:'5px'}} /></LocalizationProvider>
                    <Gelector />
                    <TextField name='type' label='Device type' variant="outlined" sx={{margin:'5px'}} fullWidth></TextField>
                    <FormControlLabel control={<Switch checked={editState} onChange={(e) => {setEditState(e.target.checked)}}/>} label="Device state" sx={{margin:'5px'}} ></FormControlLabel>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Cancel</Button>
                    <Button type="submit">Edit</Button>
                </DialogActions>
                </Dialog>
            </React.Fragment>
                    {/* DELETE */}
            <React.Fragment>
                <Button onClick={handleOpenDeleteDialog} variant="outlined" sx={{margin:"10px", color:'black', borderColor:'black'}}>Delete existing device</Button>
                <Dialog
                open={showDeleteDialog}
                onClose={handleCloseDeleteDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        (async () => {
                            const response = await fetch(`http://localhost:8080/delete_device/${slctID}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json; charset=UTF-8",
                                    "token" : `${localStorage.getItem("token")}`,
                                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                                }
                            })

                            if (response.status > 300) {
                                notify("Could not delete device", 'error');
                                handleCloseDeleteDialog();
                            }

                            notify("Device deleted", "success");
                            handleCloseDeleteDialog();
                            setUpdate(update+1);
                        }) ()
                    },
                }}
                >
                <DialogTitle>Delete device</DialogTitle>
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

export default Devices