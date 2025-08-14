import { createSlice } from "@reduxjs/toolkit";

const initialDeviceState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: [],
  lastError: null,
  filteredEntities: "",
  deviceFetchedById: "",
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const DeviceSlice = createSlice({
  name: "device",
  initialState: initialDeviceState,
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
    deviceFetched: (state, action) => {
      const deviceData = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = deviceData;
      state.totalCount = deviceData && deviceData.length;
    },
    deviceFilter: (state, action) => {
      const filteredData = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.filteredEntities = filteredData;
    },
    fetchAIModelDetails: (state, action) => {
      const aiModelDetails = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.aiModelDetails = aiModelDetails;
    },
    setAIModelFormData: (state, action) => {
      state.aiModelFormData = action.payload;
    },
    deviceFetchedById: (state, action) => {
      let deviceFetchedById = action.payload;
      state.actionsLoading = false;
      state.listLoading = false;
      state.error = null;
      state.deviceFetchedById = deviceFetchedById;
    },
    deviceCreated: (state, action) => {
      let deviceData = action.payload;
      state.actionsLoading = false;
      state.entities.push(deviceData);
      state.error = null;
    },
    deviceUpdated: (state, action) => {
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
    clearDeviceById: (state, action) => {
      state.deviceFetchedById = "";
    },
  },
});
