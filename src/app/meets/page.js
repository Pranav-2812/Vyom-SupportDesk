"use client";

import { useEffect, useRef } from "react";
import { useRouter ,  useSearchParams} from "next/navigation";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { v4 as uuid } from "uuid";

const Room = () => {
  const searchparams = useSearchParams();
  const roomID = searchparams.get("id");
  const meetingRef = useRef(null);
  const zpRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    const initializeMeeting = async () => {
      const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRECT;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        uuid(),
        "Pranav",
        720
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;
      zp.joinRoom({
        container: meetingRef.current,
        sharedLinks: [
          {
            name: "Shareable link",
            url: `${window.location.origin}/meets?id=${roomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        maxUsers: 10,
      });
    };

    initializeMeeting();
    return ()=>{
      zpRef.current.destroy();
      closeTicket()
    }
  }, []);
  const closeTicket = async()=>{
    const response = await fetch("https://sggsapp.co.in/vyom/admin/resolve_ticket.php",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({
        "ticket_id":ticketId,
        "status":"Resolved"
      })
    })
    const result = await response.json();
    if(result.success){
      alert("Closed Successdully!");
      router.push("/");
    }
    else{
      console.log(result.msg)
    }
  }
  return (
    <div className="fixed flex items-center justify-center top-0  w-screen bg-white h-full object-cover z-20">
       <div className="h-full w-full " ref={meetingRef}></div>
    </div>
  );
};

export default Room;
