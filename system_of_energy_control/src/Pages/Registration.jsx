import { Alert, Snackbar, Button, InputAdornment, TextField } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

function Registration() {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [passwordType, setPasswordType] = useState("password")
    const [showPassword, setShowPassword] = useState(true)
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [alertType, setAlert] = useState('info')
    const regex = /^(\w+[^@\t\s\n\\e\\0.,_:])$/

    const navigate = useNavigate('')

    const handleIconClick = () => {
        setShowPassword(!showPassword);
        passwordType === "password" ? setPasswordType("standart") : setPasswordType("password");
        return
    }

    function notify(messageText, typeOfAlert) {
        setOpen(true)
        setMessage(messageText)
        setAlert(typeOfAlert)
    }

    const handleSignUpClick = async () => {
        if (!login) {
            notify("Login should be filled", 'error')
            return;
        }
        if (login.search(regex) !== 0) {
            notify("Login contains banned symbols such as whitespace, tab, newline, nullcharacter, dot, coma, ':'.", 'error')
            return
        }
        if (!password) {
            notify("Password should be filled", 'error')
            return;
        }
        if (password.search(regex) !== 0) {
            notify("Password contains banned symbols such as whitespace, tab, newline, nullcharacter, dot, coma, ':'.", 'error')
            return
        }

        const response = await fetch('http://localhost:8080/signup', {
            method: "POST",
            body: JSON.stringify({
                login : login,
                password : password,
                isAdmin : false
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })

        if (response.status > 200 && response.status < 300){
            navigate('/')
            return
        }

        else {
            setOpen(true);
            setMessage("User can't be created");
            setAlert('error')
            return;
        }
    }

    const handleSnackbarClose = () => {
        setOpen(false);
    }

    const slotProps = {
        input: {
            startAdornment: (
                <InputAdornment position="start">
                    {showPassword ? <VisibilityIcon onClick={handleIconClick} fontSize="small"/> : <VisibilityOffIcon onClick={handleIconClick} fontSize="small"/>}
                </InputAdornment>
            ),
        },
    }

    return (
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", minHeight:"100vh"}}>
            <TextField value={login} onChange={(e) => {setLogin(e.target.value)}} label="Login" variant="outlined" className='standart_input' ></ TextField>
            <TextField value={password} onChange={(e) => {setPassword(e.target.value)}} slotProps={slotProps} label="Password" type={passwordType} variant="outlined" className='standart_input' ></ TextField>
            <Button variant="outlined" sx={{color:'black', borderColor:'black', width:'30vh'}} onClick={handleSignUpClick}>Sign Up</Button>
            <Snackbar open={open} autoHideDuration={4000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={alertType}>{message}</Alert>
            </Snackbar>
        </div>
    )
}

export default Registration
