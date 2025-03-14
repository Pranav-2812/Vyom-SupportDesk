import { io } from "socket.io-client";
const socket= io("https://vyom-supportdesk-signaling-server.onrender.com");
export default  socket;