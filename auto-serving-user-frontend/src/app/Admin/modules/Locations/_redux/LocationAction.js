import { callTypes, LocationSlice } from "./LocationSlice";
import {
  getAllLocation,
  getLocationById,
  addLocation,
  updateLocation,
} from "./LocationAPI";
import { successToast, warningToast } from "../../../../../utils/ToastMessage";
import { addNotification } from "../../Notification/_redux/notification";
import * as moment from "moment";

const { actions } = LocationSlice;

export const fetchLocation = () => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  getAllLocation()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.locationFetched(response.data));
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

export const fetchLocationById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getLocationById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.locationFetchedById(response.data));
      } else {
        throw new Error("Error getting location details");
      }
    })
    .catch((error) => {
      // warningToast("Something went wrong");
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createLocation = (locationData, user_id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    location_name: locationData.locationName,
    user_id: user_id,
    status: true,
    created_date: moment().toISOString(),
    updated_date: moment().toISOString(),
  };

  return addLocation(data)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(actions.addNewLocation(data));

        let data1 = {
          notification_message: "Location Added : " + locationData.locationName,
          user_id: user_id,
          type_of_notification: "string",
          status: true,
          is_unread: true,
        };
        addNotification(data1).then((response) => {
          if (response && response.isSuccess) {
            successToast("Location Added Successfully");
          }
        });
      }
    })
    .catch((error) => {
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("something went wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const locationUpdate = (locationData, user_id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    location_name: locationData.locationName || locationData.location_name,
    id: locationData.id,
    company_id: user_id,
    status: true,
    updated_date: moment().toISOString(),
  };

  return updateLocation(data)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(actions.updatedExistingLocation(data));
        successToast("Location Updated Successfully");
      }
    })
    .catch((error) => {
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const clearPopupDataAction = () => (dispatch) => {
  dispatch(actions.clearPopupData());
};


