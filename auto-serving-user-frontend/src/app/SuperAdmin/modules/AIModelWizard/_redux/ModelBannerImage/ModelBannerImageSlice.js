import {createSlice} from "@reduxjs/toolkit";

const initialModelBannerImageState = { 
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  customerForEdit: undefined,
  lastError: null,
  modelBannerImageFormData : '',
  apicalled : false
 
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const ModelBannerImageSlice = createSlice({
  name: "modelBannerImage",
  initialState: initialModelBannerImageState,
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

    setModelBannerImageFormData : (state,action) =>{
        let formData = action.payload;
        state.modelBannerImageFormData = formData;
    },

    modelBannerImageCreated : (state,action) =>{
      state.actionsLoading = false;
      state.apicalled = true
      state.error = null;
    }
}
});