import { callTypes, DeploymentJobsSlice } from "./DeploymentJobsSlice";
import { warningToast } from "../../../../../../utils/ToastMessage";
import {
  getAllDeploymentJobsDetails,
  getDeploymentJobDetailsById
} from "./DeploymentJobsApi";

const { actions } = DeploymentJobsSlice;

export const fetchDeploymentJobs = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllDeploymentJobsDetails()
    .then(response => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentJobsFetched(response.data));
      } else {
        // warningToast("something went wrong");
      }
    })
    .catch(error => {
      error.clientMessage = "Can't find deployment jobs";
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchDeploymentJobById = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getDeploymentJobDetailsById(id)
    .then(response => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentJobsFetchedById(response.data));
      } else {
        throw new Error("Error getting deployment job details");
      }
    })
    .catch(error => {
      // warningToast("Something went wrong");
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
