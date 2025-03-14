// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./slices/fetchTickets";
import meetDataReducer from "./slices/fetchMeetings";
export const store = configureStore({
  reducer: {
    data: dataReducer,
    meets:meetDataReducer
  },
});
