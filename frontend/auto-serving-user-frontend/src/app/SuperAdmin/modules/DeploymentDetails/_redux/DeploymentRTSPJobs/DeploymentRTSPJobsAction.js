import { callTypes, DeploymentRTSPJobsSlice1 } from "./DeploymentRTSPJobsSlice";
import { successToast, warningToast } from "../../../../../../utils/ToastMessage";
import {
  addNewDeploymentRTSPJobsDetails,
  getAllDeploymentRTSPJobsDetails,
  getDeploymentRTSPJobDetailsById,
  startDeploymentRTSPJob,
} from "./deploymentRTSPJobs.api";

const { actions } = DeploymentRTSPJobsSlice1;

export const fetchDeploymentRTSPJobs = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllDeploymentRTSPJobsDetails()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentRTSPJobsFetched(response.data));
      } else {
        warningToast("something went wrong");
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find deployment jobs";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createDeploymentRTSPJobs =
  (deploymentRTSPJobsData) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.action }));

    const data = {
      image_size: deploymentRTSPJobsData.imageSize,
      confidence_threshold: deploymentRTSPJobsData.confidenceThreshold,
      iou_threshold: deploymentRTSPJobsData.iouThreshold,
      model_id: deploymentRTSPJobsData.modelId,
      deployment_type_id: deploymentRTSPJobsData.deploymentTypeId,
      status: deploymentRTSPJobsData.status,
      user_id: deploymentRTSPJobsData.userId,
    };
    return addNewDeploymentRTSPJobsDetails(data)
      .then((response) => {
        if (response && response.isSuccess) {
          dispatch(actions.deploymentRTSPJobsCreated(response.data));
          successToast("Deployment Job Added Successfully");
        } else {
          throw new Error("something went wrong");
        }
      })
      .catch((error) => {
        warningToast("something went wrong");
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  };

export const fetchDeploymentRTSPJobById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getDeploymentRTSPJobDetailsById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentRTSPJobsFetchedById(response.data));
      } else {
        throw new Error("Error getting deployment job details");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const startDeploymentRTSPJobById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return startDeploymentRTSPJob(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.updateDeployedRTSPJobDetails(id));
      } else {
        throw new Error("Error while deploying job");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
