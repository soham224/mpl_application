import { createSlice } from "@reduxjs/toolkit";

const initialDeploymentJobsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  filteredEntities: "",
  deploymentJobsFetchedById: ""
};

export const callTypes = {
  list: "list",
  action: "action"
};

export const DeploymentJobsSlice = createSlice({
  name: "deploymentJobsASU",
  initialState: initialDeploymentJobsState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
        state.entities = [];
      } else {
        state.actionsLoading = false;
        state.entities = [];
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
    }
  }
});
