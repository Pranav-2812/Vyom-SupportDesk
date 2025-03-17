import ChatPage from "./ChatPage";
export default async function  fetchChats  () {
  
    // const responce = await fetch("");
    // const result = responce.json();
    
        const data = [
          {
            "conversation_id": "conv_001",
            "messages": [
              {
                "message_id": "msg_001",
                "sender_id": 2,
                "receiver_id": 1,
                "message": "Hello! How are you?",
                "timestamp": "2025-03-17T10:30:00Z"
              },
              {
                "message_id": "msg_002",
                "sender_id": 1,
                "receiver_id": 2,
                "message": "I'm good, thank you! What about you?",
                "timestamp": "2025-03-17T10:31:00Z"
              }
            ]
          },
          {
            "conversation_id": "conv_002",
            "messages": [
              {
                "message_id": "msg_003",
                "sender_id": 3,
                "receiver_id": 1,
                "message": "Hey, do you have the report ready?",
                "timestamp": "2025-03-17T11:00:00Z"
              },
              {
                "message_id": "msg_004",
                "sender_id": 1,
                "receiver_id": 3,
                "message": "Yes, I'll send it to you shortly.",
                "timestamp": "2025-03-17T11:02:00Z"
              }
            ]
          }
        ]
      
      
    return(
        <div className="width_65 flex flex-col bg-white h-[820px] notification-bell-shadow rounded-md mt-4 p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-wide ml-4">Chat Support</h1>
            <ChatPage
             chats={data}
            />
        </div>
    )
 
};
