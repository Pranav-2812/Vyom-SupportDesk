"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SimplePeer from "simple-peer";
import socket from "@/Service/socket";

export default function VideoCall({ roomId = 1235 }) {
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [userName, setUserName] = useState("");
  const [showNameModal, setShowNameModal] = useState(true);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const router = useRouter();
  const streamRef = useRef(null);
  const gotStream = useRef(false);

  // Handle name input and start call
  const handleStartCall = () => {
    if (userName.trim() === "") {
      alert("Please enter your name to join the call");
      return;
    }
    
    setShowNameModal(false);
    setIsCallStarted(true);
    initializeMediaStream();
  };

  // Initialize media stream
  const initializeMediaStream = () => {
    if (gotStream.current) return;
    gotStream.current = true;

    // Get user media
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          suppressLocalAudioPlayback: true,
        },
      })
      .then((stream) => {
        setStream(stream);
        streamRef.current = stream;
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        
        // Join room after getting media
        socket.emit("join-room", roomId, socket.id, userName);

        // Handle when a new user connects to the room
        socket.on("user-connected", (userId, peerName) => {
          console.log(`User connected: ${userId}, Name: ${peerName}`);
          connectToNewUser(userId, stream, peerName);
        });

        // Handle receiving signal from another peer
        socket.on("receiving-signal", ({ signal, userId, peerName }) => {
          console.log(`Received signal from: ${userId}, Name: ${peerName}`);
          const item = peersRef.current.find(p => p.peerID === userId);
          
          if (item) {
            item.peer.signal(signal);
            // Update peer name if it's now available
            if (peerName && !item.peerName) {
              item.peerName = peerName;
              setPeers([...peersRef.current]);
            }
          } else {
            const peer = new SimplePeer({ initiator: false, stream });
            
            peer.on("signal", (signal) => {
              socket.emit("sending-signal", { userId, signal, peerName: userName });
            });
            
            peer.on("stream", (peerStream) => {
              console.log(`Got stream from peer: ${userId}, Name: ${peerName}`);
            });
            
            peer.signal(signal);
            
            peersRef.current.push({ peerID: userId, peer, peerName });
            setPeers([...peersRef.current]);
          }
        });

        // Handle user disconnection
        socket.on("user-disconnected", (userId) => {
          console.log("User disconnected:", userId);
          const peerObj = peersRef.current.find(p => p.peerID === userId);
          if (peerObj) {
            peerObj.peer.destroy();
            peersRef.current = peersRef.current.filter(p => p.peerID !== userId);
            setPeers([...peersRef.current]);
          }
        });
      })
      .catch(err => {
        console.error("Failed to get media:", err);
        alert("Failed to access camera and microphone. Please check permissions.");
        setIsCallStarted(false);
        setShowNameModal(true);
      });
  };

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      console.log("Cleanup function: Stopping media and socket");
      
      socket.off("user-connected");
      socket.off("receiving-signal");
      socket.off("user-disconnected");
      
      if (socket.connected) {
        socket.disconnect();
      }
      
      peersRef.current.forEach(({ peer }) => {
        if (peer) peer.destroy();
      });
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  // Function to connect to a new user
  const connectToNewUser = (userId, stream, peerName) => {
    console.log(`Connecting to new user: ${userId}, Name: ${peerName}`);
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (signal) => {
      console.log("Sending signal to:", userId);
      socket.emit("sending-signal", { userId, signal, peerName: userName });
    });

    peer.on("stream", (peerStream) => {
      console.log("Got stream from:", userId);
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    peersRef.current.push({ peerID: userId, peer, peerName });
    setPeers([...peersRef.current]);
  };

  // Toggle Video
  const toggleVideo = () => {
    if (!streamRef.current) return;
    
    streamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !isVideoOn;
    });
    setIsVideoOn((prev) => !prev);
  };

  // Toggle Audio
  const toggleAudio = () => {
    if (!streamRef.current) return;
    
    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !isAudioOn;
    });
    setIsAudioOn((prev) => !prev);
  };

  // Name input modal
  const NameModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Enter Your Name</h2>
        <p className="mb-4">Please enter your name to join the video call</p>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleStartCall();
          }}
        />
        <button
          onClick={handleStartCall}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Join Call
        </button>
      </div>
    </div>
  );

  if (showNameModal) {
    return <NameModal />;
  }

  return (
    <div className="fixed top-0 w-screen h-screen flex flex-row justify-center items-center bg-white z-20">
      <div className="w-3/4 h-full flex flex-row justify-center ml-6 flex-wrap">
        <div className="h-2/3 w-11/12 px-4 bg-amber-300 mt-3 rounded-xl notification-bell-shadow">
          {peers.length === 1 ? (
            <Video peer={peers[0].peer} peerName={peers[0].peerName || "Peer User"} />
          ) : (
            <div className="flex items-center justify-center h-full text-lg font-medium text-gray-700">
              Waiting for others to join...
            </div>
          )}
        </div>
        {peers.length > 1 ? (
          <div className="h-1/4 w-11/12 px-4 bg-amber-300 overflow-x-auto mt-3 rounded-xl notification-bell-shadow flex">
            {peers.map(({ peer, peerID, peerName }, index) => (
              <Video key={peerID || index} peer={peer} peerName={peerName || "Peer User"} />
            ))}
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="w-1/4 h-full flex flex-col justify-end py-4 mr-4">
        <div className="relative w-full flex flex-col items-center max-w-md mx-auto">
          <video
            ref={userVideo}
            autoPlay
            muted
            playsInline
            className="rounded-xl box-shadow -scale-x-100 w-[450px] h-[300px] object-cover"
          />
          <div
            className={`w-full absolute bottom-2 left-1 bg-opacity-50 text-black font-bold px-3 rounded-md text-sm ${
              isVideoOn ? "text-black" : "text-white"
            }`}
          >
            {userName || "You"} (You)
          </div>
        </div>
        <span className="flex flex-row items-center justify-center gap-10 mt-4">
          <button 
            onClick={toggleAudio}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            {isAudioOn ? (
              <i
                className="fa-solid fa-microphone scale-sm cursor-pointer"
                title="Turn Off Mic"
              ></i>
            ) : (
              <i
                className="fa-solid fa-microphone-slash scale-sm cursor-pointer"
                title="Turn on Mic"
              ></i>
            )}
          </button>
          <button 
            onClick={toggleVideo}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            {isVideoOn ? (
              <i
                className="fa-solid fa-video scale-sm cursor-pointer"
                title="Turn off camera"
              ></i>
            ) : (
              <i
                className="fa-solid fa-video-slash scale-sm cursor-pointer"
                title="Turn on camera"
              ></i>
            )}
          </button>
          <button 
            onClick={() => router.push('/')}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white"
          >
            <i
              className="fa-solid fa-phone-slash scale-sm cursor-pointer"
              title="End Call"
            ></i>
          </button>
        </span>
      </div>
    </div>
  );
}

function Video({ peer, peerName }) {
  const ref = useRef();

  useEffect(() => {
    if (!peer) return;
    
    peer.on("stream", (stream) => {
      console.log("Setting peer stream to video element");
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
    
    return () => {
      // Cleanup
      if (ref.current && ref.current.srcObject) {
        ref.current.srcObject.getTracks().forEach(track => track.stop());
        ref.current.srcObject = null;
      }
    };
  }, [peer]);

  return (
    <div className="flex flex-col justify-end py-4 mr-4">
      <div className="relative w-full flex flex-col items-center max-w-md mx-auto">
        <video 
          ref={ref} 
          autoPlay 
          playsInline 
          className="rounded-xl box-shadow w-[450px] h-[300px] object-cover"
        />
        <div
          className="w-full absolute bottom-2 left-1 bg-opacity-50 bg-black bg-opacity-50 text-white font-bold px-3 rounded-md text-sm"
        >
          {peerName}
        </div>
      </div>
    </div>
  );
}