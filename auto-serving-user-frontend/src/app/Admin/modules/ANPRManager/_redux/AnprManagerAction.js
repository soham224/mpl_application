
import {
    addVehicleDetails,
    getAllVehicleDetails,
    getSpeedDetails,
    getVehicleDetailsByNumberPlate,
    updateVehicleDetails, updateVehicleDetailsStatus, uploadVehicleDetails
} from "./AnprManagerApi";
import {callTypes, AnprManagerSlice} from "./AnprManagerSlice";
import {warningToast} from "../../../../../utils/ToastMessage";

const { actions } = AnprManagerSlice;

export const getAllVehicleDetail = () => async (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));
    getAllVehicleDetails()
        .then((response) => {
            if (response && response.isSuccess) {
                dispatch(actions.getAllVehicleDetails(response.data));
            } else {
            }
        })
        .catch((error) => {
            error.clientMessage = "Can't find locations";
            if (error.detail) {
                warningToast(error.detail);
            } else {
                warningToast("Something went Wrong");
            }
            dispatch(actions.catchError({ error, callType: callTypes.list }));
        });
};

export const addVehicleDetail = (data) => async (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));
    addVehicleDetails(data)
        .then((response) => {
            if (response && response.isSuccess) {
                dispatch(actions.addVehicleDetails(response.data));
            } else {
            }
        })
        .catch((error) => {
            error.clientMessage = "Can't find locations";
            if (error.detail) {
                warningToast(error.detail);
            } else {
                warningToast("Something went Wrong");
            }
            dispatch(actions.catchError({ error, callType: callTypes.list }));
        });
};


export const getSpeedDetail = (data) => async (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));
    getSpeedDetails(data)
        .then((response) => {
            if (response && response.isSuccess) {
                dispatch(actions.getSpeedDetails(response.data));
            } else {
            }
        })
        .catch((error) => {
            error.clientMessage = "Can't find locations";
            if (error.detail) {
                warningToast(error.detail);
            } else {
                warningToast("Something went Wrong");
            }
            dispatch(actions.catchError({ error, callType: callTypes.list }));
        });
};

export const getVehicleDetailsByNumberPlates = (numberPlate) => async (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));
    return getVehicleDetailsByNumberPlate(numberPlate)
        .then((response) => {
            if (response && response.isSuccess) {
                return response?.data;
            }
        })
        .catch((error) => {
            error.clientMessage = "Can't find locations";
            if (error.detail) {
                // warningToast(error.detail);
            } else {
                warningToast("Something went Wrong");
            }
            dispatch(actions.catchError({ error, callType: callTypes.list }));
        });
};



export const updateVehicleDetail = (data,id) => async (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));
    updateVehicleDetails(data,id)
        .then((response) => {
            if (response && response.isSuccess) {
                dispatch(actions.updateVehicleDetails(response.data));
            } else {
            }
        })
        .catch((error) => {
            error.clientMessage = "Can't find locations";
            if (error.detail) {
                warningToast(error.detail);
            } else {
                warningToast("Something went Wrong");
            }
            dispatch(actions.catchError({ error, callType: callTypes.list }));
        });
};

export const updateVehicleDetailsStatuses = (id, vehicleStatus) => async (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));

    // Return the Promise from the API call
    return updateVehicleDetailsStatus(id, vehicleStatus)
        .then((response) => {
            if (response && response.isSuccess) {
                // Dispatch any additional actions if needed
                // dispatch(actions.updateVehicleDetails(response.data));
                return response; // Resolve the promise with the response
            } else {
                throw new Error("Update failed"); // Reject the promise
            }
        })
        .catch((error) => {
            error.clientMessage = "Can't update vehicle details";
            if (error.detail) {
                warningToast(error.detail);
            } else {
                warningToast("Something went wrong");
            }
            dispatch(actions.catchError({ error, callType: callTypes.list }));
            throw error; // Reject the promise with the error
        });
};
export const uploadVehicleDetail = (file) => async (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));

    // Return the Promise from the API call
    return uploadVehicleDetails(file)
        .then((response) => {
            if (response && response.isSuccess) {
                // Dispatch any additional actions if needed
                // dispatch(actions.updateVehicleDetails(response.data));
                return response; // Resolve the promise with the response
            } else {
                throw new Error("Update failed"); // Reject the promise
            }
        })
        .catch((error) => {
            error.clientMessage = "Can't update vehicle details";
            if (error.detail) {
                warningToast(error.detail);
            } else {
                warningToast("Something went wrong");
            }
            dispatch(actions.catchError({ error, callType: callTypes.list }));
            throw error; // Reject the promise with the error
        });
};



