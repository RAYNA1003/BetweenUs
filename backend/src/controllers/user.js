import httpStatus from "http-status";
import {Userzoom} from "../models/user.js";
import {Meeting} from "../models/meeting.js";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
const login=async(req,res)=>{
   const {username,password}=req.body;
  
   try{

     if(!username || !password){
       return res.status(400).json({message:"pls provide all credentials"});
     }
    const user=await Userzoom.findOne({username});
     
    if(!user){
        return res.status(httpStatus.NOT_FOUND).json({message:"user was not found"});
    }

    if(await bcrypt.compare(password,user.password)){
        let token= crypto.randomBytes(20).toString("hex");
        user.token=token;
        await user.save();
        return res.status(httpStatus.OK).json({token:token,message:"user logged in successfully"});
    }else{
        return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid username or password"});
    }

   }catch(e){
     console.log(e);
     res.status(500).json({message:e.message});
   }


}
const register=async(req,res)=>{
    const {name,username,password}=req.body;

    try{
        const user=await Userzoom.findOne({username});
        if(user){
            return res.status(httpStatus.FOUND).json({message:"user already exists"});
        }

        const hashedpassword=await bcrypt.hash(password,10);

        const newuser=new Userzoom({
            name:name,
            username:username,
            password:hashedpassword
        })

        await newuser.save();

        res.status(httpStatus.CREATED).json({message:"User registered successfully"});

    }catch(e){
        res.status(500).json({message:e.message});
        console.log(e);
    }
}

const getuserhistory=async(req,res)=>{
    const {token}=req.query;

    try{
        const user= await Userzoom.findOne({token:token});
        const meetings=await Meeting.find({user_id:user.username});
        res.json(meetings);
    }catch(e){
       res.json({message:`Something went wrong: ${e}`});
    }
}

const addToHistory=async(req,res)=>{
    const {token,meeting_code}=req.body;
    try{
        const user= await Userzoom.findOne({token:token});
        

        const newMeeting= new Meeting(

            {user_id:user.username,
             meetingCode:meeting_code,
            }

        )

        await newMeeting.save();
        res.status(httpStatus.CREATED).json({message:"Added to history"})


    }catch(e){
       res.json({message:`Something went wrong: ${e}`});
    }
}

export {register,login,getuserhistory,addToHistory};