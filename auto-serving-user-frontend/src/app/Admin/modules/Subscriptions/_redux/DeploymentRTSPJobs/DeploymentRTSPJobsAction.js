import { callTypes, DeploymentRTSPJobsSlice } from "./DeploymentRTSPJobsSlice";
import { warningToast } from "../../../../../../utils/ToastMessage";
import {
  getAllDeploymentRTSPJobsDetails,
  getDeploymentRTSPJobDetailsById
} from "./DeploymentRTSPJobsApi";

const { actions } = DeploymentRTSPJobsSlice;

export const fetchDeploymentRTSPJobs = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllDeploymentRTSPJobsDetails()
    .then(response => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentRTSPJobsFetched(response.data));
      } else {
        // warningToast("something went wrong");
      }
    })
    .catch(error => {
      error.clientMessage = "Can't find deployment rtsp jobs";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
    });
};

export const fetchDeploymentRTSPJobById = id => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getDeploymentRTSPJobDetailsById(id)
    .then(response => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentRTSPJobsFetchedById(response.data));
      } else {
        throw new Error("Error getting deployment rtsp job details");
      }
    })
    .catch(error => {
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
