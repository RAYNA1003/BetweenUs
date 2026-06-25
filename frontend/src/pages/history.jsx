import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css'


export default function History(){

    const {gethistory}=useContext(AuthContext);
    const [meetings,setMeetings]=useState([]);

    const routeTo=useNavigate();

    useEffect(()=>{
        const fetchHistory=async()=>{
             try{
                const history= await gethistory();
                setMeetings(history);
             }catch(e){
                
             }

             
        }
        fetchHistory();
    },[]);
    let formatDate=(dataString)=>{
      const date=new Date(dataString);
      const day=date.getDate().toString();
      const month=(date.getMonth()+1).toString();
      const year=date.getFullYear();

      return `${day}/${month}/${year}`
    }

    return(
        <div>
          <div className="btn1">
            <IconButton onClick={()=>{
              routeTo("/home");
            }}>
              <HomeIcon />
            </IconButton>
          </div>
            {
                meetings.map((e,i)=>{
                    return(
                        <>
                        <Card key={i} variant="outlined">
                          <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        Meeting-Code: {e.meetingCode}
      </Typography>
      
      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}> Date: {formatDate(e.date)}</Typography>
      <Typography variant="body2">
       
       
        
      </Typography>
    </CardContent>
    
                        </Card>
                        </>
                    )
                })
            }
           
            </div>
    )
}