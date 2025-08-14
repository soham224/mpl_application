import { createSlice } from "@reduxjs/toolkit";

const initialS3DataHandlerState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  customerForEdit: undefined,
  lastError: null,
  s3DataHandlerFormData: "",
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const S3DataHandlerSlice = createSlice({
  name: "S3DataHandler",
  initialState: initialS3DataHandlerState,
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

    setS3DataHandlerFormData: (state, action) => {
      let formData = action.payload;
      state.s3DataHandlerFormData = formData;
    },
    s3DataHandlerCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
    },
  },
});
