import { callTypes, DeployedJobsSlice1 } from "./DeployedJobsSlice";
import { warningToast } from "../../../../../../utils/ToastMessage";
import {
  getAllDeployedJobsDetails,
  terminateDeployedJob,
} from "./deployedJobs.api";

const { actions } = DeployedJobsSlice1;

export const fetchDeployedJobs = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllDeployedJobsDetails()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deployedJobsFetched(response.data));
      } else {
        warningToast("something went wrong");
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find deployed jobs";
      warningToast("something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const terminateDeployedJobById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return terminateDeployedJob(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.updateDeployedJobDetails(id));
      } else {
        throw new Error("Error while terminating deployed job");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
