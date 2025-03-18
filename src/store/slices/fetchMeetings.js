import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch data from an API
export const fetchMeetData = createAsyncThunk("data/fetchMeetData", async () => {
    const response = await fetch(`https://sggsapp.co.in/vyom/admin/fetch_scheduled_tickets.php?assigned_agent_id=${localStorage.getItem("agentId")}`,{
        method:"GET",
       
    });
    const result = await response.json();
    console.log(result);
    return result;
});

const dataSlice = createSlice({
  name: "meets",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMeetData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMeetData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
