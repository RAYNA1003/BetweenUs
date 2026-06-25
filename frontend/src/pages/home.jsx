import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import RestoreIcon from '@mui/icons-material/Restore';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import '../App.css'
import vid from '../images/vid.png';
import { Button } from '@mui/material';

export function HomeComponent(){

    const navigate=useNavigate();
    const [meetingcode,setmeetingcode]=useState("");


     const {addtohistory}=useContext(AuthContext);
    let handlevidcall= async()=>{
        await addtohistory(meetingcode);
        navigate(`/${meetingcode}`)
    }

    let handlehistory=async()=>{
        navigate('/history');
    }
    return(
       
       <div >
       <nav>
        <div style={{display:"flex",alignItems:"center"}}>
            <h2>Between Us</h2>
        </div>
        <div style={{display:"flex",alignItems:"center"}}>
           <IconButton onClick={handlehistory}>
            <RestoreIcon></RestoreIcon>
            <h6>History</h6>
           </IconButton>
           <Button onClick={()=>{
            localStorage.removeItem("token");
            navigate("/auth");
           }}>Log Out</Button>
        </div>

       </nav>

       <div className="meetContainer">
        <div className="leftPanel">
            <div>
            <h3>Providing Quality Video Call to have a Quality Experience</h3><br></br>
            <div style={{display:"flex",gap:"10px"}}>
                <TextField onChange={e=>setmeetingcode(e.target.value)} id="outlined-basic" label="Meeting Code" variant="outlined" /><br></br>

                <Button variant='contained' onClick={handlevidcall}>Join</Button>
            </div>
                </div>
        </div>

        <div className="rightPanel">
            <img src={vid} />
        </div>
       </div>
       </div>
    )
}
export default withAuth(HomeComponent);