import { callTypes, DeployedJobsSlice } from "./DeployedJobsSlice";
import { getAllDeployedJobsDetails } from "./DeployedJobsApi";
import { warningToast } from "../../../../../../utils/ToastMessage";

const { actions } = DeployedJobsSlice;

export const fetchDeployedJobs = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllDeployedJobsDetails()
    .then(response => {
      if (response && response.isSuccess) {
        dispatch(actions.deployedJobsFetched(response.data));
      } else {
        // warningToast("something went wrong");
      }
    })
    .catch(error => {
      error.clientMessage = "Can't find deployed jobs";
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
