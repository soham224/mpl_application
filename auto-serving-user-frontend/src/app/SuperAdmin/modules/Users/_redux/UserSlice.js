import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  lastError: null,
  filteredEntities: "",
  userDetails: "",
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const UserSlice = createSlice({
  name: "device",
  initialState: initialUserState,
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

    userFetched: (state, action) => {
      const userData = action.payload;

      state.listLoading = false;
      state.error = null;
      state.entities = userData;
      state.totalCount = userData && userData.length;
    },
    userFilter: (state, action) => {
      const filteredData = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.filteredEntities = filteredData;
    },
    userCreated: (state, action) => {
      let userData = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.entities.push(userData);
      state.error = null;
    },

    viewUserDetails: (state, actions) => {
      let userDetails = actions.payload;
      state.actionsLoading = false;
      state.userDetails = userDetails;
    },
    userStatusChanged: (state, actions) => {
      let { status, id } = actions.payload;
      state.entities = state.entities.map((entity) => {
        if (entity.id === id) {
          return { ...entity, company_status: status === "true" };
        }
        return entity;
      });
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
    },
  },
});
