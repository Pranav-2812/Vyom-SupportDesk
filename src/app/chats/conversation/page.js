"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Conversation() {
  const searchParams = useSearchParams();
  const chat_id = searchParams.get("id");
  const user_id = 1; // Assuming logged-in user ID (Replace with actual user ID logic)

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessageId, setLastMessageId] = useState(0);
  
  // Add a ref to the message container
  const messageContainerRef = useRef(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  // Fetch message history when component loads
  const fetchMessageHistory = async () => {
    try {
      const response = await fetch(
        `https://sggsapp.co.in/vyom/fetch_msg_history.php?conversation_id=${chat_id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch message history");

      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        setMessages(data.messages);
        if (data.messages.length > 0) {
          setLastMessageId(data.messages[data.messages.length - 1].id);
        }
        // Scroll to bottom after messages are loaded
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error("Error fetching message history:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://sggsapp.co.in/vyom/get_messages.php?conversation_id=${chat_id}&last_message_id=${lastMessageId}`,
        { method: "GET", cache: "no-store" }
      );
  
      if (!response.ok) throw new Error("Failed to fetch new messages");
  
      const data = await response.json();
  
      if (data.status === "success" && data.messages.length > 0) {
        setMessages((prevMessages) => {
          const lastId = prevMessages.length > 0 ? prevMessages[prevMessages.length - 1].id : 0;
          const newMessages = data.messages.filter((msg) => msg.id > lastId);
  
          if (newMessages.length > 0) {
            return [...prevMessages, ...newMessages];
          }
  
          return prevMessages; // Avoid re-render if no new messages
        });
  
        // Update lastMessageId using functional update to ensure we always use the latest state
        setLastMessageId((prevId) => {
          const newLastId = data.messages[data.messages.length - 1]?.id || prevId;
          return newLastId;
        });
        
        // If there are new messages, scroll to bottom
        if (data.messages.length > 0) {
          setTimeout(scrollToBottom, 100);
        }
      }
  
      // Keep polling for new messages
      setTimeout(fetchMessages, 2000);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setTimeout(fetchMessages, 3000); // Retry after 3 seconds if error occurs
    }
  };
  
  // Send a message
  const sendMsg = async () => {
    if (msg.trim() === "") return;

    try {
      const response = await fetch(
        "https://sggsapp.co.in/vyom/send_message.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: chat_id,
            sender_id: 1,
            message: msg,
            receiver_id: 11
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      setMsg(""); // Clear input after sending
      // We don't need to scroll here as the fetchMessages function will handle it
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchMessageHistory();
    if (messages) {
      fetchMessages();
    }
    
    // Cleanup function to clear the setTimeout on component unmount
    return () => clearTimeout(fetchMessages);
  }, []);

  // Effect to scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="width_65 flex flex-col items-center justify-between bg-white h-[820px] notification-bell-shadow rounded-md mt-4 space-y-6">
      <div className="w-full flex flex-col items-center rounded-xl">
        <h1 className="w-full text-2xl flex flex-row items-center gap-10 font-bold text-start px-4 py-4 bottom-shadow bg-blue-200 rounded-t-md">
          <i className="fa-solid fa-circle-user scale-md mx-3 my-2 cursor-pointer"></i>
          <p>{chat_id}</p>
        </h1>
        <div
          ref={messageContainerRef}
          className="w-11/12 h-[650px] flex flex-col overflow-y-auto hide px-16 py-6"
          id="msgBox"
        >
          {messages.map((message, index) => (
            <span
              key={index}
              className={`px-4 py-1 notification-bell-shadow rounded-md my-1 tracking-wide ${
                message.sender_id === user_id
                  ? "bg-red-500 text-white self-end"
                  : "bg-blue-500 text-white self-start"
              }`}
            >
              {message.message}
            </span>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-row items-center justify-center gap-10 px-10 bg-red-200 py-4">
        <input
          type="text"
          className="w-3/4 outline-none border-2 border-red-400 bg-blue-100 rounded-md py-2 indent-3"
          placeholder="Type Here.."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          onKeyDown={(e) => e.key === "Enter" && sendMsg()} // Call sendMsg on Enter
        />
        <button
          type="button"
          className="1/4 disabled:cursor-none"
          onClick={sendMsg}
          disabled={msg === ""}
        >
          <i
            title="Send"
            className="fa-regular disabled:bg-red-300 fa-paper-plane scale-sm bg-blue-400 notification-bell-shadow cursor-pointer px-3 rounded-md py-1.5"
          ></i>
        </button>
      </div>
    </div>
  );
}