"use client";
import { useSelector , useDispatch } from "react-redux";
import { useEffect } from "react";
import ChatPage from "./ChatPage";
import { fetchChatListData } from "@/store/slices/fetchChatList";
export default  function  fetchChats  () {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state)=>state.chats);
  console.log(items)
    useEffect(() => {
        dispatch(fetchChatListData());
    }, [dispatch]);
    return(
        <div className="width_65 flex flex-col bg-white h-[820px] notification-bell-shadow rounded-md mt-4 p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-wide ml-4">Chat Support</h1>
            <ChatPage
             chats={items?.data}
            />
        </div>
    )
 
};
