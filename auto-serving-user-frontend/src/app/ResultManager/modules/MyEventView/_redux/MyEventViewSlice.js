import {createSlice} from "@reduxjs/toolkit";

const initialMyResult = {
    refreshResult: false,
    entities: [],
    actionsLoading : true
};

export const MyResultSliceResultManager = createSlice({
    name: "MyResultSliceResultManager",
    initialState: initialMyResult,
    reducers: {
        reloadResults: (state, action) => {
            state.refreshResult = !state.refreshResult;
        },
        setEntities: (state, action) => {
            state.actionsLoading = false
            state.entities = action.payload;
        }
    }
});
