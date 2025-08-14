import { createSlice } from "@reduxjs/toolkit";

const initialDeployedJobsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  filteredEntities: "",
  deployedJobsFetchedById: ""
};

export const callTypes = {
  list: "list",
  action: "action"
};

export const DeployedJobsSlice = createSlice({
  name: "deployedJobsASU",
  initialState: initialDeployedJobsState,
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

    deployedJobsFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.entities = action.payload;
      state.totalCount = action.payload.length;
    }
  }
});
