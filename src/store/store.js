// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./slices/fetchTickets";
import meetDataReducer from "./slices/fetchMeetings";
import chatDataReducer from "./slices/fetchChatList";
import authReducer from "./slices/Auth";
export const store = configureStore({
  reducer: {
    data: dataReducer,
    meets:meetDataReducer,
    chats:chatDataReducer,
    auth:authReducer
  },
});
