import {createSlice} from "@reduxjs/toolkit";

const initialInferJobsState = {
    listLoading: false,
    actionsLoading: false,
    totalCount: 0,
    entities: [],
    filteredEntities: '',
    inferJobsFetchedById: ""
};

export const callTypes = {
    list: "list",
    action: "action"
};

export const InferJobsSlice = createSlice({
    name: "inferJobs",
    initialState: initialInferJobsState,
    reducers: {

        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        startCall: (state, action) => {
            state.error = null;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } else {
                state.actionsLoading = true;
            }
        },

        inferJobsFetched: (state, action) => {
            state.listLoading = false;
            state.error = null;
            state.entities = action.payload;
            state.totalCount = action.payload.length;
        },

        inferJobsFetchedById: (state, action) => {
            state.actionsLoading = false;
            state.listLoading = false;
            state.error = null;
            state.inferJobsFetchedById = action.payload;
        },

        inferJobsCreated: (state, action) => {
            state.actionsLoading = false;
            state.entities.push(action.payload);
            state.error = null;
        },

    }
});
