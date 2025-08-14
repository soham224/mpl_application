import { createSlice } from "@reduxjs/toolkit";

const initialDeployedJobsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  filteredEntities: "",
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const DeployedJobsSlice1 = createSlice({
  name: "deployedJobs",
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
    },

    updateDeployedJobDetails: (state, action) => {
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.entities = state.entities.map((e) =>
        e.id === action.payload * 1
          ? {
              ...e,
              instance_status: "terminated",
            }
          : e
      );
    },
  },
});
