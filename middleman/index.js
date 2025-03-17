const express = require("express");
const { v4: uuidv4 } = require("uuid"); // Generate unique IDs
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{origin:"*"} //allow every client 
})

app.use("/",async(req,res)=>{
    res.send("Vyom Meet Middleman Server");
});

io.on('connection', (socket) => {
  console.log(`new user connected ${socket.id}`);
  
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    // Store the user's name in the socket object
    socket.userName = userName;
    // Emit to all other sockets in the room with the new user's name
    socket.to(roomId).emit("user-connected", userId, userName);
  
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
  
  socket.on("sending-signal", ({ userId, signal, peerName }) => {
    io.to(userId).emit("receiving-signal", { 
      signal, 
      userId: socket.id,
      peerName: peerName || socket.userName
    });
  });
  
  socket.on('disconnect', () => {
    console.log(`${socket.id} user disconnected`);
  });
});
server.listen(5000,()=>{
    console.log(`server running on http://127.0.0.1:5000`);
})