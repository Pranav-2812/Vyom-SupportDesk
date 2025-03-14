"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Import router for navigation detection
import SimplePeer from "simple-peer";
import socket from "@/Service/socket";

export default function VideoCall({ roomId = 1235 }) {
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const router = useRouter();
  const streamRef = useRef(null);
  const  gotStream = useRef(false);
  useEffect(() => {
    if (gotStream.current) return;
    gotStream.current = true;
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
        console.log(stream.getTracks());
        streamRef.current = stream;
        userVideo.current.srcObject = stream;
        socket.emit("join-room", roomId, socket.id);

        socket.on("user-connected", (userId) => {
          const peer = new SimplePeer({ initiator: true, stream });
          peer.on("signal", (signal) => {
            socket.emit("sending-signal", { userId, signal });
          });

          peersRef.current.push({ peerID: userId, peer });
          setPeers([...peersRef.current]);
        });

        socket.on("receiving-signal", ({ signal, userId }) => {
          const peer = new SimplePeer({ initiator: false, stream });
          peer.signal(signal);

          peersRef.current.push({ peerID: userId, peer });
          setPeers([...peersRef.current]);
        });
      });

    return () => {
      console.log("Cleanup function: Stopping media and socket");

      socket.disconnect();
      peersRef.current.forEach(({ peer }) => peer.destroy());
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          console.log(track);
          track.stop(); 
          streamRef.current.removeTrack(track); 
          console.log("Stopped track:", track.kind);
        });
        // streamRef.current = null;
      }
    };
  }, []);

  // // ✅ Toggle Video (Turn off camera completely when stopped)
  // const toggleVideo = () => {
  //   setIsVideoOn((prev) => !prev);
  //   stream?.getVideoTracks().forEach((track) => {
  //     track.enabled = !isVideoOn
  //   });
  // };

  // ✅ Toggle Audio
  // const toggleAudio = () => {
  //   if (!streamRef.current) return;
  //   streamRef.current.getAudioTracks().forEach((track) => {
  //     track.enabled = !isAudioOn;

  //   });
  //   setIsAudioOn((prev) => !prev);
  // };

  return (
    <div className="fixed top-0 w-screen h-screen flex flex-col justify-center items-center bg-white z-20">
      <video ref={userVideo} autoPlay muted playsInline className="rounded-xl box-shadow -scale-x-100" />
      {peers.map(({ peer }, index) => (
        <Video key={index} peer={peer} />
      ))}
    </div>
  );
}

function Video({ peer }) {
  const ref = useRef();
  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);
  return <video ref={ref} autoPlay playsInline />;
}
