import { callTypes, DeviceSlice } from "./DeviceSlice";
import { successToast } from "../../../../../utils/ToastMessage";
import {
  getAllDevice,
  getDeviceById,
  saveDevice,
  updateDevice,
} from "./device.api";
const { actions } = DeviceSlice;

export const fetchDevice = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllDevice()
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;

        dispatch(actions.deviceFetched(data));
        dispatch(actions.deviceFilter(data));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createDevice = (deviceData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    device_name: deviceData.deviceName,
    device_description: deviceData.deviceDescription,
    status: deviceData.status,
  };

  return saveDevice(data)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;

        dispatch(actions.deviceCreated(data));
        successToast("Device Added Successfully");
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchDeviceById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getDeviceById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;

        dispatch(actions.deviceFetchedById(data));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deviceUpdate = (deviceData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    device_name: deviceData.deviceName || deviceData.device_name,
    device_description:
      deviceData.deviceDescription || deviceData.device_description,
    status: deviceData.status,
    id: deviceData.id,
  };

  return updateDevice(data)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;

        dispatch(actions.deviceUpdated(data));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
