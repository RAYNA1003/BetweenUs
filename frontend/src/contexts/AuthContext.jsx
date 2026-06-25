import axios, { HttpStatusCode } from "axios";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment.js"
import {createContext} from 'react'


export const AuthContext=createContext({});

const client=axios.create({
    baseURL: `${server}/api/v1/users`
})

export const AuthProvider=({children})=>{
    const authContext=useContext(AuthContext);

    const [userdata,setdata]=useState(authContext);

    const router=useNavigate();
    const handleRegister=async(name,username,password)=>{
        try{
            let request=await client.post("/register",{
                name:name,
                username:username,
                password:password
            })
            console.log("status:", request.status, "expected:", HttpStatusCode.CREATED);

            if (request.status === 201) {
               return request.data.message;
             }
        }catch(e){
           throw e;
        }
    }

    const handleLogin=async(username,password)=>{
        try{
            let request=await client.post("/login",{
                username:username,
                password:password
            })
             if (request.status === 200) {
                 localStorage.setItem("token",request.data.token);
                 router("/home");
               return request.data.message;
             }
             
        }catch(e){
            throw e;
        }
    }
    const gethistory=async()=>{
        try{
            let request=await client.get("/get_all_activity",{
                params:{
                    token:localStorage.getItem("token")

                }
            });

            return request.data;
        }
        catch(e){
            throw e;
        }
    }

    const addtohistory=async(meetingCode)=>{
        try{
            let request=await client.post("/add_to_activity",{
                    token:localStorage.getItem("token"),
                    meeting_code:meetingCode,
                }
            );

            return request;
        }catch(e){
            throw e;
        }
    }
    

    const data={
        userdata,setdata,handleRegister,handleLogin,addtohistory,gethistory
    }

    return(
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}