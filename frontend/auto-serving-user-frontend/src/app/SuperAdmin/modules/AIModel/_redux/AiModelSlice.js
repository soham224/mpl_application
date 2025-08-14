import { createSlice } from "@reduxjs/toolkit";

const initialAIModelState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  customerForEdit: undefined,
  lastError: null,
  filteredEntities: "",
  aiModelViewDetails: "",
  deviceViewDetails: "",
  modelTypeViewDetails: "",
  frameworkViewDetails: "",
  deviceDetails: "",
  modelTypeDetails: "",
  frameworkDetails: "",
  aiModelFormData: "",
  aiModelDataById: "",
  aiModelCreatedData: "",
  temp: false,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const AiModelSlice = createSlice({
  name: "aiModel",
  initialState: initialAIModelState,
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
    aiModelFetched: (state, action) => {
      const aiModelData = action.payload;

      state.listLoading = false;
      state.error = null;
      state.entities = aiModelData;
      state.totalCount = aiModelData && aiModelData.length;
    },
    aiModelFilter: (state, action) => {
      const filteredData = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.filteredEntities = filteredData;
    },

    fetchAIModelViewDetails: (state, action) => {
      const viewDetails = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.aiModelViewDetails = viewDetails;
    },
    fetchDeviceViewDetails: (state, action) => {
      const viewDetails = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.deviceViewDetails = viewDetails;
    },
    fetchModelTypeViewDetails: (state, action) => {
      const viewDetails = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.modelTypeViewDetails = viewDetails;
    },
    fetchFrameworkViewDetails: (state, action) => {
      const viewDetails = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.frameworkViewDetails = viewDetails;
    },

    fetchDeviceDetails: (state, action) => {
      const deviceDetails = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.deviceDetails = deviceDetails;
    },
    fetchModelTypeDetails: (state, action) => {
      const modelTypeDetails = action.payload;

      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.modelTypeDetails = modelTypeDetails;
    },
    fetchFrameworkDetails: (state, action) => {
      const frameworkDetails = action.payload;

      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.frameworkDetails = frameworkDetails;
    },

    fetchAIModelDetails: (state, action) => {
      const aiModelDetails = action.payload;

      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.aiModelDetails = aiModelDetails;
    },

    setAIModelFormData: (state, action) => {
      let aiModelFormData = action.payload;
      state.aiModelFormData = aiModelFormData;
    },

    aiModelFetchedById: (state, action) => {
      let aiModelDataById = action.payload;

      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.aiModelDataById = aiModelDataById;
    },
    aiModelCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.temp = true;
      state.aiModelCreatedData = action.payload;
    },
    aiModelUpdated: (state, action) => {
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
  },
});
