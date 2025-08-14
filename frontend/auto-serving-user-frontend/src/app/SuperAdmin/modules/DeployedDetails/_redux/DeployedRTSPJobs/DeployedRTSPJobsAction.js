import { callTypes, DeployedRTSPJobsSlice1 } from "./DeployedRTSPJobsSlice";
import { warningToast } from "../../../../../../utils/ToastMessage";
import {
  getAllDeployedRTSPJobsDetails,
  terminateDeployedRTSPJob,
} from "./deployedRTSPJobs.api";

const { actions } = DeployedRTSPJobsSlice1;

export const fetchDeployedRTSPJobs = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllDeployedRTSPJobsDetails()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deployedRTSPJobsFetched(response.data));
      } else {
        warningToast("something went wrong");
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find deployedRTSP jobs";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const terminateDeployedRTSPJobById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return terminateDeployedRTSPJob(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.updateDeployedRTSPJobDetails(id));
      } else {
        throw new Error("Error while terminating deployed rtsp job");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
