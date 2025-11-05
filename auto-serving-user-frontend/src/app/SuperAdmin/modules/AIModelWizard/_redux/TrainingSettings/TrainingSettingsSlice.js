import { createSlice } from "@reduxjs/toolkit";

const initialTrainingSettingsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  customerForEdit: undefined,
  lastError: null,
  trainingSettingsFormData: "",
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const TrainingSettingsSlice = createSlice({
  name: "trainingSettings",
  initialState: initialTrainingSettingsState,
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
    setTrainingSettingsFormData: (state, action) => {
      let formData = action.payload;
      state.trainingSettingsFormData = formData;
    },

    trainingSettingsCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
    },
  },
});
