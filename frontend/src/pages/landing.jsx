import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import img from '../images/poop3.png'
import "../App.css"

export default function LandingPage(){
     const routeTo=useNavigate();
    return(
        <div style={{backgroundImage:`url(${img})`}} className='lpcontainer'>
            <nav>
                <div className='navHeader'><span style={{color:"#064f59"}}>Between Us</span> <span style={{fontStyle:'italic',fontSize:15}}> ~Your Video Calling Platform</span></div>
                <div className='navlist'>
                    <p onClick={()=>{
                        routeTo("/vyun");
                    }}>Join as Guest</p>
                    <p onClick={()=>{
                         routeTo("/auth");
                    }}>Register</p>
                    <div role="button"onClick={()=>{
                         routeTo("/auth");
                    }} >Login</div>
                </div>
            </nav>

        <div className="landingcontain">
            <div>
                <h2><span style={{color:"#FF9839"}} >Connect</span> with your loved Ones</h2>
                <p style={{fontSize:20}}>Cover a distance through Between Us</p>
                <div role='button'className='btn'>
                    <Link style={{textDecoration:'none',color:'black'}} to='/auth'>Get started</Link>
                </div>
                
            </div>
        </div>
        </div>
    )
}