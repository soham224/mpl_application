import {createSlice} from "@reduxjs/toolkit";

const initialLocationState = {
    listLoading: false,
    actionsLoading: false,
    totalCount: 0,
    entities: [],
    filteredEntities: "",
    fetchEmailById: "",
    tableData: false,
    popupData:[]
};

export const callTypes = {
    list: "list",
    action: "action"
};

export const NotificationManagerSlice = createSlice({
    name: "notificationManager",
    initialState: initialLocationState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
                state.entities = [];
                state.tableData = false;
                state.popupData = []
            } else {
                state.actionsLoading = false;
                state.entities = [];
                state.tableData = false;
                state.popupData = []
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

        fetchEmail: (state, action) => {
            state.listLoading = false;
            state.error = null;
            state.entities = action.payload;
            state.totalCount = action.payload.length;
            state.tableData = true;
        },

        addNewNotification: (state, action) => {
            state.actionsLoading = false;
            state.entities.push(action.payload);
            state.error = null;
            state.tableData = true;
        },

        updatedExistingNotification: (state, action) => {
            let data = action.payload;
            state.listLoading = false;
            state.error = null;
            state.entities = state.entities.map(entity => {
                if (entity.id === data.id) {
                    return data;
                }
                return entity;
            });
        },

        fetchEmailById: (state, action) => {
            state.actionsLoading = false;
            state.listLoading = false;
            state.error = null;
            state.fetchEmailById = action.payload;
            state.tableData = true;
        },

        clearNotificationById: (state, action) => {
            state.actionsLoading = false;
            state.listLoading = false;
            state.error = null;
            state.fetchEmailById = null;
        },

        popupData: (state, action) => {
            state.actionsLoading = false;
            state.listLoading = false;
            state.error = null;
            state.popupData = action.payload;
        },

        clearPopupData: (state, action) => {
            state.actionsLoading = false;
            state.listLoading = false;
            state.error = null;
            state.popupData = [];
        }

    }
});
