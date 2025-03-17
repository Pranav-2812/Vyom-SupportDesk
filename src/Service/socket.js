import { io } from "socket.io-client";
//https://vyom-supportdesk-signaling-server.onrender.com
const socket= io("http://127.0.0.1:5000");
export default  socket;