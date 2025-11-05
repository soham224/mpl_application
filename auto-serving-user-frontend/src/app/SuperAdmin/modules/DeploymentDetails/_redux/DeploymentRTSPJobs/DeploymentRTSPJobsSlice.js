import { createSlice } from "@reduxjs/toolkit";

const initialDeploymentRTSPJobsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  filteredEntities: "",
  deploymentRTSPJobsFetchedById: "",
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const DeploymentRTSPJobsSlice1 = createSlice({
  name: "deploymentRTSPJobs",
  initialState: initialDeploymentRTSPJobsState,
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

    deploymentRTSPJobsFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.entities = action.payload;
      state.totalCount = action.payload.length;
    },

    deploymentRTSPJobsFetchedById: (state, action) => {
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.deploymentRTSPJobsFetchedById = action.payload;
    },

    deploymentRTSPJobsCreated: (state, action) => {
      state.actionsLoading = false;
      state.entities.push(action.payload);
      state.error = null;
    },

    updateDeployedRTSPJobDetails: (state, action) => {
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.entities = state.entities.map((e) =>
        e.id === action.payload * 1 ? { ...e, status: true } : e
      );
    },
  },
});
