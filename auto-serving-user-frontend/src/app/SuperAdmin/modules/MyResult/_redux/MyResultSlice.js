import { createSlice } from "@reduxjs/toolkit";

const initialMyResult = {
  refreshResult: false,
  entities: [],
};

export const MyResultSlice1 = createSlice({
  name: "myResult",
  initialState: initialMyResult,
  reducers: {
    reloadResults: (state, action) => {
      state.refreshResult = !state.refreshResult;
    },
    setEntities: (state, action) => {
      state.entities = action.payload;
    },
  },
});
