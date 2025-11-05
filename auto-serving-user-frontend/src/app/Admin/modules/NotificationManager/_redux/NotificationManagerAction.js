import { callTypes, NotificationManagerSlice } from "./NotificationManagerSlice";
import {
 getAllEmail, getEmailById, addEmail, updateEmail,
} from "./NotificationManagerAPI";
import { successToast, warningToast } from "../../../../../utils/ToastMessage";

const { actions } = NotificationManagerSlice;

export const fetchEmail = () => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  getAllEmail()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.fetchEmail(response.data));
      } else {
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find notification";
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchEmailById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getEmailById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.fetchEmailById(response.data));
      } else {
        throw new Error("Error getting notification details");
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

export const createEmail = (notificationData, user_id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return addEmail(notificationData)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(actions.addNewNotification(data));
        successToast("Notification Added Successfully");
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

export const emailUpdate = (notificationData, user_id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return updateEmail(notificationData)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(actions.updatedExistingNotification(data));
        successToast("Notification Updated Successfully");
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


