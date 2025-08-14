import { createSlice } from "@reduxjs/toolkit";

const initialAnprManagerState = {
    listLoading: false,
    actionsLoading: false,
    totalCount: 0,
    entities: [],
    getAllVehicleDetails: [],
    getSpeedDetails: [],
    getVehicleDetailsByNumberPlate: [],
    addVehicleDetails:[],
    updateVehicleDetails:[],
    lastError: null,
    page: 1,
    size: 10,
};
export const callTypes = {
    list: "list",
    action: "action"
};

export const AnprManagerSlice = createSlice({
    name: "anprManager",
    initialState: initialAnprManagerState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
                state.entities = [];
                state.getAllVehicleDetails = [];
                state.getSpeedDetails = [];
                state.getVehicleDetailsByNumberPlate = [];
                state.addVehicleDetails =[];
                state.updateVehicleDetails =[];

            } else {
                state.actionsLoading = false;
                state.entities = [];
                state.getAllVehicleDetails = [];
                state.getSpeedDetails = [];
                state.getVehicleDetailsByNumberPlate = [];
                state.addVehicleDetails =[];
                state.updateVehicleDetails =[];
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

        getAllVehicleDetails: (state, action) => {
            state.listLoading = false;
            state.error = null;
            state.getAllVehicleDetails = action.payload;
            state.totalCount = action.payload.length;
        },
        getSpeedDetails: (state, action) => {
            state.listLoading = false;
            state.error = null;
            state.getSpeedDetails = action.payload;
            state.page = action.payload.page;
            state.size = action.payload.size;
            state.totalCount = action.payload.length;
        },



        addVehicleDetails: (state, action) => {
            state.listLoading = false;
            state.actionsLoading = false;
            state.error = null;
            state.addVehicleDetails = action.payload;
            state.page = action.payload.page;
            state.size = action.payload.size;
            state.totalCount = action.payload.length;
        },
        updateVehicleDetails: (state, action) => {
            state.listLoading = false;
            state.actionsLoading = false;
            state.error = null;
            state.updateVehicleDetails = action.payload;
            state.page = action.payload.page;
            state.size = action.payload.size;
            state.totalCount = action.payload.length;
        },


        getVehicleDetailsByNumberPlate:(state , action) => {
            state.listLoading = false;
            state.error = null;
            state.getVehicleDetailsByNumberPlate = action.payload;
        },

        clearVehicleDetails: (state, action) => {
            state.entities = [];
        }
    }
});
