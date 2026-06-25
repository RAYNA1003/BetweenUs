import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  position: 'relative',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function SignIn() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [showForgot, setShowForgot] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('');

  const validateInputs = () => {
    const email = document.getElementById('username');
    const password = document.getElementById('password');
    let isValid = true;

    if (!username.value) {
    setEmailError(true); setEmailErrorMessage('Please enter a username.'); isValid = false;
  } else { setEmailError(false); setEmailErrorMessage(''); }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true); setPasswordErrorMessage('Password must be at least 6 characters long.'); isValid = false;
    } else { setPasswordError(false); setPasswordErrorMessage(''); }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInputs()) return;
    const data = new FormData(event.currentTarget);
    console.log({ email: data.get('email'), password: data.get('password') });
  };

  const [username,setusername]=React.useState();
  const [password,setpass]=React.useState();
  const [name,setname]=React.useState();
  const [error,seterror]=React.useState();
  const [messages,setmessages]=React.useState();
  const routeTo=useNavigate();
  const [formstate,setform]=React.useState(0);
  const [open,setopen]=React.useState(false);
  const {handleRegister,handleLogin}=React.useContext(AuthContext);
  let handleAuth=async()=>{
    try{
        if(formstate===0){
            let result=await handleLogin(username,password);
            console.log(result);
            setmessages(result);
            setopen(true);
            seterror("");
            setpass("");
            setusername("");
            
        }if(formstate===1){
            let result=await handleRegister(name,username,password);
            console.log(result);
            setmessages(result);
            setopen(true);
            seterror("");
            setpass("");
            setusername("");
            setform(0);
            

        }
    }catch(e){
       
       let message=(e.response.data.message);
       seterror(message);
    }
  }

  return (
    <div className='bg overlay'>
      
    <ThemeProvider theme={theme}>
     
      <CssBaseline />

      {/* Forgot Password Overlay */}
      {showForgot && (
        <Box sx={{
          position: 'fixed', inset: 0, zIndex: 1300,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Box sx={{
            background: '#fff', borderRadius: 2, p: 4, width: '100%', maxWidth: 400,
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <Typography variant="h6">Reset password</Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email and we'll send you a reset link.
            </Typography>
            <TextField
              autoFocus fullWidth type="email" placeholder="Email address"
              value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setShowForgot(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => { console.log('Reset for:', resetEmail); setShowForgot(false); }}>
                Continue
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      <SignInContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <div>
        <h1 style={{textAlign:"center",cursor:"pointer"}} onClick={()=>{
    routeTo("/")
        }}><span style={{color:"#064f59"}}>Between </span><span style={{color:"#FF9839"}}>Us </span></h1>
      </div>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#1976d2" />
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">S</text>
          </svg>

          <div>
           
            
            <Button variant={formstate===0?"contained":""} onClick={()=>{setform(0)}} >
                Sign In
            </Button>
            <Button variant={formstate===1?"contained":""} onClick={()=>{setform(1)}} >
                Sign Up
            </Button>
          </div>

          <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
             {formstate===1?
             <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField id="name" 
                name="name" placeholder="Full name" autoFocus required fullWidth onChange={(e)=>{setname(e.target.value)}} value={name}/>
            </FormControl>
            :<></>}
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField  id="username" 
                name="username" placeholder="your name" autoFocus required fullWidth onChange={(e)=>{setusername(e.target.value)}} value={username} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField name="password"
                placeholder="••••••" type="password" id="password"  required fullWidth onChange={(e)=>{setpass(e.target.value)}} value={password}/>
            </FormControl>
            <p style={{color:"red"}}>{error}</p>
            <Button type="button" fullWidth variant="contained" onClick={handleAuth}>{formstate===0?"Log in":"Sign up"}</Button>
           
          </Box>

         
        </Card>
      </SignInContainer>
      <Snackbar

      open={open}
      autoHideDuration={4000}
      message={messages}

      />
    </ThemeProvider>
    </div>
  );
}