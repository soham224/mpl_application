import { callTypes, DeployedRTSPJobsSlice } from "./DeployedRTSPJobsSlice";
import { getAllDeployedRTSPJobsDetails } from "./DeployedRTSPJobsApi";
import { warningToast } from "../../../../../../utils/ToastMessage";

const { actions } = DeployedRTSPJobsSlice;

export const fetchDeployedRTSPJobs = queryParams => dispatch => {
  dispatch(actions.startCall({ callType: callTypes.list }));
   return getAllDeployedRTSPJobsDetails()
        .then(response => {
      if (response && response.isSuccess) {
        dispatch(actions.deployedRTSPJobsFetched(response.data));
      } else {
        // warningToast("something went wrong");
      }
    })
    .catch(error => {
      error.clientMessage = "Can't find deployed rtsp jobs";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      if (error.detail) {
        warningToast(error.detail);
      } else {
        warningToast("Something went Wrong");
      }
    });
};
