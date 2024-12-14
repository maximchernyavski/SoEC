import { Alert, Snackbar, Button } from "@mui/material";
import React from 'react'
import { useState } from "react";

function Diagnostic() {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlert] = useState('info')

    function notify(messageText, typeOfAlert) {
        setOpen(true)
        setMessage(messageText)
        setAlert(typeOfAlert)
    }

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    const handleStartDiagnosticClick = () => {
        ( async () => {
            notify("Diagnostic started", "info")
            await new Promise(resolve => setTimeout(resolve, 6000))

            const response = await fetch('http://localhost:8080/add_report', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                    "token" : `${localStorage.getItem("token")}`,
                    "isAdmin" : `${localStorage.getItem("isAdmin")}`
                },
                body: JSON.stringify({
                    header : "The most important report that has been created on this server ",
                    body : "Here we can see very interesting and usefull information about devices energy consumption and if these values exceed norms. Maybe we see recommendations."
                }),
            })

            if(response.status > 300) {
                notify("Sadge", "warning")
                return
            }

            notify("Life is good", "success")
        }) ()
    }

    

    return (
        <div>
            <Button variant="outlined" sx={{margin:"10px", color:'black', borderColor:'black'}} onClick={handleStartDiagnosticClick}>Start diagnostic</Button >
            <Snackbar open={open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={alertType}>{message}</Alert>
            </Snackbar>
        </div>
    )
}

export default Diagnostic