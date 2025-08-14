import { createSlice } from "@reduxjs/toolkit";

const initialDeployedRTSPJobsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  filteredEntities: "",
  deployedRTSPJobsFetchedById: "",
  showTable: false
};

export const callTypes = {
  list: "list",
  action: "action"
};

export const DeployedRTSPJobsSlice = createSlice({
  name: "deployedRTSPJobsASU",
  initialState: initialDeployedRTSPJobsState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
        state.entities = [];
        state.showTable = false;
      } else {
        state.actionsLoading = false;
        state.entities = [];
        state.showTable = false;
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

    deployedRTSPJobsFetched: (state, action) => {
      const data = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = data.map(d => ({ ...d, isRTSP: true }));
      state.totalCount = action.payload.length;
      state.showTable = true;
    }
  }
});
