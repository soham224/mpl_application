import { createSlice } from "@reduxjs/toolkit";

const initialModelTypeState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  lastError: null,
  filteredEntities: "",
  modelTypeFetchedById: "",
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const ModelTypeSlice = createSlice({
  name: "modelType",
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

    modelTypeFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.entities = action.payload;
      state.totalCount = action.payload.length;
    },

    modelTypeFetchedById: (state, action) => {
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.modelTypeFetchedById = action.payload;
    },

    modelTypeCreated: (state, action) => {
      state.actionsLoading = false;
      state.entities.push(action.payload);
      state.error = null;
    },
    modelTypeUpdated: (state, action) => {
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
    clearModelTypeById: (state, action) => {
      state.modelTypeFetchedById = "";
    },
  },
});
