import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js"
import connectToSocket from "./controllers/socketmanager.js"

const app=express();
const server=createServer(app);
const io= connectToSocket(server);

app.set("port",(process.env.PORT || 8800) );
app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));
app.use("/api/v1/users",userRoutes);


app.get("/home",(req,res)=>{
    return res.send("You are in home page rn");
});

server.listen(app.get("port"),async ()=>{
    const connectiondb=await mongoose.connect("mongodb+srv://Rayna:gKYWhZapHVUrt6Hu@cluster0.eokjuub.mongodb.net/");
    console.log("db connected");
    console.log("listening on port 8800");
});
