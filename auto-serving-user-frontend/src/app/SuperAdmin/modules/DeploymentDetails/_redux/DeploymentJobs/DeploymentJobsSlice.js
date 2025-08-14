import {createSlice} from "@reduxjs/toolkit";

const initialDeploymentJobsState = {
    listLoading: false,
    actionsLoading: false,
    totalCount: 0,
    entities: [],
    filteredEntities: '',
    deploymentJobsFetchedById: ""
};

export const callTypes = {
    list: "list",
    action: "action"
};

export const DeploymentJobsSlice1 = createSlice({
    name: "deploymentJobs",
    initialState: initialDeploymentJobsState,
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

        deploymentJobsFetched: (state, action) => {
            state.listLoading = false;
            state.error = null;
            state.entities = action.payload;
            state.totalCount = action.payload.length;
        },

        deploymentJobsFetchedById: (state, action) => {
            state.actionsLoading = false;
            state.listLoading = false;
            state.error = null;
            state.deploymentJobsFetchedById = action.payload;
        },

        deploymentJobsCreated: (state, action) => {
            state.actionsLoading = false;
            state.entities.push(action.payload);
            state.error = null;
        },

        updateDeployedJobDetails: (state, action) => {
            state.actionsLoading = false;
            state.listLoading = false;
            state.error = null;
            state.entities = state.entities.map(e => e.id === action.payload * 1 ? {...e, status: true} : e);
        }
    }
});
