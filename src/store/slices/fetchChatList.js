import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch data from an API
export const fetchChatListData = createAsyncThunk("data/fetchChatList", async () => {
    const response = await fetch(`https://sggsapp.co.in/vyom/get_conversations.php?agent_id=${localStorage.getItem("agentId")}`,{
        method:"GET",
       
    });
    const result = await response.json();
    console.log(result);
    return result;
});

const dataSlice = createSlice({
  name: "chats",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatListData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChatListData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchChatListData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
