import { createSlice } from "@reduxjs/toolkit";

const initialModelTypeState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  frameworkDetailsFetchedById: "",
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const FrameworkDetailsSlice = createSlice({
  name: "frameworkDetails",
  initialState: initialModelTypeState,
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

    frameworkDetailsFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.entities = action.payload;
      state.totalCount = action.payload.length;
    },

    frameworkDetailsFetchedById: (state, action) => {
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.frameworkDetailsFetchedById = action.payload;
    },

    frameworkDetailsCreated: (state, action) => {
      state.actionsLoading = false;
      state.entities.push(action.payload);
      state.error = null;
    },

    frameworkDetailsUpdated: (state, action) => {
      let data = action.payload;
      state.listLoading = false;
      state.actionsLoading = false;
      state.error = null;
      state.entities = state.entities.map((entity) => {
        if (entity.id === data.id) {
          return data;
        }
        return entity;
      });
    },

    clearFrameworkDetailsById: (state, action) => {
      state.frameworkDetailsFetchedById = "";
    },
  },
});
