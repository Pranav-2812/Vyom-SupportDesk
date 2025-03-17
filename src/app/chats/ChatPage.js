"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
const ChatPage = ({ chats }) => {
  const router = useRouter();
  useEffect(() => {
    document.title = "Chat Support - Vyom Assist";
  }, []);
  const handleClick = (chat_id)=>{
    router.push(`/chats/conversation?id=${chat_id}`);
  }
  return(
    <div className="w-full flex flex-col h-[700px] overflow-y-auto hide items-center gap-4">
        {
            chats.map((chat, i)=>{
                return (
                    <div className="w-11/12 bg-blue-200 box-shadow rounded-md flex flex-row h-16 cursor-pointer px-10 items-center justify-start gap-10" onClick={()=>{handleClick(chat.conversation_id)}} key={i} >
                        <i className="fa-solid fa-circle-user scale-md"></i>
                        <h1 className="text-xl font-bold text-amber-50">{chat.conversation_id}</h1>
                    </div>
                )
            })
        }
    </div>
  );
};
export default ChatPage;
