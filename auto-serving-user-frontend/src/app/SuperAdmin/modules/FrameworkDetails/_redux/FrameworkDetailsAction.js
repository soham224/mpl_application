import { callTypes, FrameworkDetailsSlice } from "./FrameworkDetailsSlice";
import { successToast, warningToast } from "../../../../../utils/ToastMessage";
import {
  addNewFrameworkDetails,
  getAllFrameworkDetails,
  getFrameworkDetailsById,
  updateFrameworkDetails,
} from "./framework.api";

const { actions } = FrameworkDetailsSlice;

export const fetchFrameworkDetails = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllFrameworkDetails()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.frameworkDetailsFetched(response.data));
      } else {
        warningToast("something went wrong");
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find frameworks detail";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createFrameworkDetails = (frameworkDetailsData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    framework_name: frameworkDetailsData.frameworkName,
    framework_version_number: frameworkDetailsData.frameworkVersionNo,
    is_deprecated: frameworkDetailsData.deprecated,
    status: frameworkDetailsData.status,
  };
  return addNewFrameworkDetails(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.frameworkDetailsCreated(response.data));
        successToast("Framework Details Added Successfully");
      } else {
        throw new Error("something went wrong");
      }
    })
    .catch((error) => {
      warningToast("something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchFrameworkDetailsById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getFrameworkDetailsById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.frameworkDetailsFetchedById(response.data));
      } else {
        throw new Error("Error getting framework details");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const frameworkDetailsUpdate = (frameworkDetailsData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    framework_name:
      frameworkDetailsData.frameworkName || frameworkDetailsData.framework_name,
    framework_version_number:
      frameworkDetailsData.frameworkVersionNo ||
      frameworkDetailsData.framework_version_number,
    is_deprecated:
      frameworkDetailsData.deprecated + "" === "undefined"
        ? frameworkDetailsData.is_deprecated
        : frameworkDetailsData.deprecated,
    status: frameworkDetailsData.status,
    id: frameworkDetailsData.id,
  };

  return updateFrameworkDetails(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.frameworkDetailsUpdated(response.data));
      } else {
        throw new Error("Error updating framework details");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
