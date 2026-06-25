import React, { useState,useRef, useEffect, createElement } from 'react'
import TextField from '@mui/material/TextField';
import io from "socket.io-client";
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import VideocamIcon from '@mui/icons-material/Videocam';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import Button from '@mui/material/Button';
import "../styles/vidcomp.css"
import server from "../environment.js"
import { useNavigate } from 'react-router-dom';
import { Description } from '@mui/icons-material';
const server_url=server;

var connections={};

const peerConfigConnections={
    "iceservers":[
        {"urls":"stun:stun.l.google.com:19302"}
    ]
}

export default function Vidmeetcomponent(){

    var socketref=useRef();
    let socketidref=useRef();

    let localvidref=useRef();

    let [videoavail,setvidavail]=useState(true);
    let [audioavail,setaudioavail]=useState(true);

    let [vid,setvid]=useState();
    let [aud,setaud]=useState();

    let [screen,setScreen]=useState();
    let [showmodal,setmodal]=useState(true);
    let [screenavail,setscreenavail]=useState();
    let [message,setmessage]=useState([]);
    let [messages,setmessages]=useState([]);
    let [newmsg,setnewmsg]=useState(3);
    let [askforusername,setaskforusername]=useState(true);
    let [username,setusername]=useState("");
    const vidref=useRef([]);

    let [videos,setvideos]=useState([]);

    const getPermissions=async()=>{
        try{
            const vidpermit=await navigator.mediaDevices.getUserMedia({video:true});
            if(vidpermit){
                setvidavail(true);
            }else setvidavail(false);
             const audiopermit=await navigator.mediaDevices.getUserMedia({audio:true});
             if(audiopermit){
                setaudioavail(true);
             }else audioavail(false);


             if(navigator.mediaDevices.getDisplayMedia){
                setscreenavail(true);
             }else{
                setscreenavail(false);
             }

             if(videoavail || audioavail){
                const usermediastream=await navigator.mediaDevices.getUserMedia({video:videoavail,audio:audioavail});
                if(usermediastream){
                    window.localStream=usermediastream;
                    if(localvidref.current){
                        localvidref.current.srcObject=usermediastream;
                    }
                }
             }

        }catch(e){
   console.log(e);
        }

    }
    useEffect(()=>{
        getPermissions();
    },[])

    let getusermediasuccess=(stream)=>{
        try{
            window.localStream.getTracks().forEach(track=>track.stop());
        }catch(e){console.log(e)}

        window.localStream=stream;
        localvidref.current.srcObject=stream;

        for(let id in connections){
            if(id===socketidref.current) continue;

           window.localStream.getTracks().forEach(track => {
    connections[id].addTrack(track, window.localStream);
});

            connections[id].createOffer().then((description)=>{
                connections[id].setLocalDescription(description)
                .then(()=>{
                    socketref.current.emit("signal",id,JSON.stringify({"sdp":connections[id].localDescription}))
                })
                
            })
        }

        stream.getTracks().forEach(track=>track.onended=()=>{
            setvid(false);
            setaud(false);
        

        try{
            let tracks=localvidref.current.srcObject.getTracks()
            tracks.forEach(track=>track.stop());
        }catch(e){
            console.log(e)
        }

        let blackSilence=(...args)=>new MediaStream([black(...args),silence()]);
        window.localStream=blackSilence();
        localvidref.current.srcObject=window.localStream;

        for(let id in connections){
           window.localStream.getTracks().forEach(track => {
    connections[id].addTrack(track, window.localStream);
});

            connections[id].createOffer().then((description)=>{
                connections[id].setLocalDescription(description)
                .then(()=>{
                    socketref.current.emit("signal",id,JSON.stringify({"sdp": connections[id].localDescription}))
                })
            })
        }

       })
    
    }

    let silence=()=>{
        let ctx=new AudioContext();
        let oscillator=ctx.createOscillator();

        let dst=oscillator.connect(ctx.createMediaStreamDestination());

        oscillator.start();
        ctx.resume();

        return Object.assign(dst.stream.getAudioTracks()[0],{enabled:false});
    }

    let black=({width=640,height=480}={})=>{

            let canvas =Object.assign(document.createElement("canvas"),{width,height});
            canvas.getContext('2d').fillRect(0,0,width,height);
            let stream=canvas.captureStream();

            return Object.assign(stream.getVideoTracks()[0],{enabled:false})
    }


    let  getUserMedia=()=>{
        if((vid && videoavail) || (aud && audioavail)){
            navigator.mediaDevices.getUserMedia({video:vid,audio:aud})
            .then((stream)=>getusermediasuccess(stream))
            
            .catch((e)=>console.log(e));
        }else{
            try{
                let tracks=localvidref.current.srcObject.getTracks();
                tracks.forEach(track=>track.stop());
            }catch(e){

            }
        }
    }
    let gotmessagefromserver=(fromID,message)=>{
        var signal =JSON.parse(message);

        if(fromID!==socketidref.current){
            if(signal.sdp){
                connections[fromID].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
                    if(signal.sdp.type==="offer"){
                        connections[fromID].createAnswer().then((description)=>{
                            connections[fromID].setLocalDescription(description).then(()=>{
                                socketref.current.emit("signal",fromID,JSON.stringify({"sdp": connections[fromID].localDescription}))
                            })
                        }).catch(e=>console.log(e))
                    }
                }).catch(e=>console.log(e))
            }

            if(signal.ice){
                connections[fromID].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e=>console.log(e))
            }
        }
    }
    let addMessage=(data,sender,socketIdSender)=>{
         setmessages((prevmsgs)=>[...prevmsgs,{sender:sender,data:data}]
         );

         if(socketIdSender!== socketidref.current){
            setnewmsg((prevmsgs)=>prevmsgs+1)
         }
    }

    let routeTo=useNavigate();
    let connectToSocketServer=()=>{
       socketref.current=io.connect(server_url,{secure:false});
       socketref.current.on('signal',gotmessagefromserver);
       socketref.current.on("connect",()=>{
        socketref.current.emit("join-call",window.location.href);

        socketidref.current=socketref.current.id;
        socketref.current.on("chat-message",addMessage);
       socketref.current.on("user-left",(id)=>{
    // stop the stream tracks first
    let leftVideo = vidref.current.find(video => video.socketID === id);
    if(leftVideo && leftVideo.stream){
        leftVideo.stream.getTracks().forEach(track => track.stop());
    }

    // close the peer connection
    if(connections[id]){
        connections[id].close();
        delete connections[id];
    }

    // update both state and ref
    setvideos((videos) => {
        const filtered = videos.filter((video) => video.socketID !== id);
        vidref.current = filtered;  // ✅ sync the ref too!
        return filtered;
    });
});
         socketref.current.on("user-joined",(id,clients)=>{
            console.log("user-joined fired", id, clients);
            clients.forEach((socketListId)=>{
                connections[socketListId]=new RTCPeerConnection(peerConfigConnections);
                connections[socketListId].onicecandidate=(event)=>{
                    if(event.candidate!==null){
                        socketref.current.emit("signal",socketListId,JSON.stringify({'ice': event.candidate}))
                    }
                }

               connections[socketListId].ontrack = (event) => {
    let videoexists = vidref.current.find(video => video.socketID === socketListId);
    if (videoexists) {
        setvideos(videos => {
           
            const updatevids = videos.map(video =>
                video.socketID === socketListId ? { ...video, stream: event.streams[0] } : video
            );
            vidref.current = updatevids;
            return updatevids;
        });
    } else {
       
        let newVideo = {
            socketID: socketListId,
            stream: event.streams[0],
            autoPlay: true,
            playsinline: true
        };
        setvideos(videos => {
              if(videos.some(v => v.socketID === socketListId)) return videos;
            const updatedvids = [...videos, newVideo];
            vidref.current = updatedvids;
            return updatedvids;
        });
    }
};

                if(window.localStream!==undefined && window.localStream!==null){
                    window.localStream.getTracks().forEach(track => {
    connections[socketListId].addTrack(track, window.localStream);
});


                }else{
                    let blackSilence=(...args)=>new MediaStream([black(...args),silence()]);
                    window.localStream=blackSilence();
                    window.localStream.getTracks().forEach(track => {
    connections[socketListId].addTrack(track, window.localStream);
});

                }


            })
            if(id===socketidref.current){
                for(let id2 in connections){
                    if(id2 === socketidref.current) continue;

                    try{
                       window.localStream.getTracks().forEach(track => {
    connections[id2].addTrack(track, window.localStream);
});

                    }catch(e){
                        connections[id2].createOffer().then((description)=>{
                            connections[id2].setLocalDescription(description)
                            .then(()=>{
                                socketref.current.emit("signal",id2,JSON.stringify({"sdp":connections[id2].localDescription}))
                            })
                            
                        })
                    }
                }
            }

            
        });

       })
    }
    useEffect(()=>{
        if(aud!==undefined && vid!==undefined){
            getUserMedia();
        }
    },[aud,vid])

    let getMedia=(()=>{
    setvid(videoavail);
    setaud(audioavail);
    
    connectToSocketServer();
    })

    let handleVid=()=>{
        setvid(!vid);
    }
    let handleAud=()=>{
        setaud(!aud);
    }

    let handlescreen=()=>{
        setScreen(!screen);
    }
     let handlechat=()=>{
        setmodal(!showmodal);
    }

    

    let sendmessage=()=>{
        socketref.current.emit("chat-message",message,username);
    }

    let getDisplayMediaSuccess=(stream)=>{
        try{
            window.localStream.getTracks().forEach(track=>track.stop);

        }catch(e) {console.log(e);}

        window.localStream=stream;
        localvidref.current.srcObject=stream;

        for(let id in connections){
            if(id===socketidref.current) continue;

            window.localStream.getTracks().forEach(track => {
    connections[id].addTrack(track, window.localStream);
});
            connections[id].createOffer().then((description)=>{
                connections[id].setLocalDescription(description)
                .then(()=>{
                    socketref.current.emit("signal",id,JSON.stringify({"sdp":connections[id].localDescription}))
                })
                .catch(e=>console.log(e))
            })
        }
        stream.getTracks().forEach(track=>track.onended=()=>{
           setScreen(false);
        

        try{
            let tracks=localvidref.current.srcObject.getTracks()
            tracks.forEach(track=>track.stop());
        }catch(e){
            console.log(e)
        }

        let blackSilence=(...args)=>new MediaStream([black(...args),silence()]);
        window.localStream=blackSilence();
        localvidref.current.srcObject=window.localStream;

        getUserMedia();

       })
    
    }
    let getDisplayMedia=()=>{
        if(screen){
           if(navigator.mediaDevices.getDisplayMedia){
            navigator.mediaDevices.getDisplayMedia({video:true,audio:true})
            .then(getDisplayMediaSuccess)
            .then((stream)=>{})
            .catch(e=>console.log(e))
           }
        }
    }
    useEffect(()=>{
        if(screen!== undefined){
            getDisplayMedia();
        }
    },[screen]);
    let connect=()=>{
        setaskforusername(false);
        getMedia();
    }
    let handleend=()=>{
        try{
            let tracks=localvidref.current.srcObject.getTracks();
            tracks.forEach(track=>track.stop());
        }catch(e){console.log(e);}
        routeTo('/home');
    }
    // todo
    // if(isChrome()===false)
    return(
        
        <div>
        {askforusername===true?
        <div>

        <h2 style={{marginLeft:"10px",marginBottom:"10px",textAlign:"center"}}>Enter Into Lobby</h2>
        <div style={{display:"flex",marginLeft:"10px",marginBottom:"10px",justifyContent:"center",gap:"5px"}}>
        <TextField id='outlines-basic' label='username' value={username} onChange={(e)=>setusername(e.target.value)} ></TextField>
        <Button variant="contained" onClick={connect}>Connect</Button>
         </div>
         
        <div>
            <video style={{width:"100vw",height:"80vh"}} ref={localvidref} autoPlay muted></video>
            
        </div>
            </div>:<div className='meetcontainer'>
               {showmodal? <div className="chatroom">
               <div className="chatcontainer">
                   
                  <h1>Chat</h1>
                  <div className="chattingarea">
                   <div className="chattingdisplay">
                    {messages.map((item,index)=>{
                        return(
                            <div key={index}>
                             <p style={{fontWeight:"bold"}}><span>{item.sender}</span></p>
                             <p style={{marginBottom: 10}}>{item.data}</p>
                            </div>
                        )
                    })}
                   </div>
                   <TextField id="outlined-basic" label="Enter your message" variant="outlined" value={message} onChange={e=>setmessage(e.target.value)}/>
                    <Button style={{height:56,marginLeft:10}} variant='contained' onClick={sendmessage}>Send</Button>

                   </div>
               </div>
               </div>:<></>}
                <div className="btncontainer">
                    <IconButton style={{color:"white"}} onClick={handleVid}>
                        {(vid===true)?<VideocamIcon />:<VideocamOffIcon />}
                    </IconButton>
                     <IconButton style={{color:"red"}} onClick={handleend} >
                       <CallEndIcon />
                    </IconButton>
                     <IconButton style={{color:"white"}} onClick={handleAud}>
                        {(aud===true)?<MicIcon />:<MicOffIcon />}
                    </IconButton>
                     <IconButton style={{color:"white"}} onClick={handlescreen}>
                        {(screenavail===true)?
                        (screen===true)?<ScreenShareIcon />:<StopScreenShareIcon />:<></>}
                    </IconButton>
                    <Badge badgeContent={newmsg} style={{color:"orange"}} max={999} color='secondary' >
                        <IconButton style={{color:"white"}} onClick={handlechat}>
                       <ChatIcon />
                    </IconButton>
                    </Badge>
                </div>
               <video className='meetuservid' ref={localvidref} autoPlay muted></video>
               <div className='conferenceview'>
                {videos.map((video)=>{
                    return(
                    <div key={video.socketID}>
                       
                        <video
                        
                        data-socket={video.socketID}
                        ref={ref=>{if (ref && video.stream){
                            ref.srcObject=video.stream;
                        }else if(ref) {
            ref.srcObject = null;  // ✅ clear when stream gone
        }
                        
                        }} autoPlay>

                        </video>
                    </div>
                    )
                })}
           </div>
            </div>
            }
        </div>
        
    )
}