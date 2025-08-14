import { createSlice } from "@reduxjs/toolkit";

const initialModelResultImageState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  customerForEdit: undefined,
  lastError: null,
  modelResultImageFormData: "",
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const ModelResultImageSlice = createSlice({
  name: "modelResultImage",
  initialState: initialModelResultImageState,
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
    setModelResultImageFormData: (state, action) => {
      let formData = action.payload;
      state.modelResultImageFormData = formData;
    },
    modelResultImageCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
    },
  },
});
