import { callTypes, DeploymentJobsSlice1 } from "./DeploymentJobsSlice";
import { successToast, warningToast } from "../../../../../../utils/ToastMessage";
import {
  addNewDeploymentJobsDetails,
  getAllDeploymentJobsDetails,
  getDeploymentJobDetailsById,
  startDeploymentJob,
} from "./deploymentJobs.api";

const { actions } = DeploymentJobsSlice1;

export const fetchDeploymentJobs = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllDeploymentJobsDetails()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentJobsFetched(response.data));
      } else {
        warningToast("something went wrong");
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find deployment jobs";
      warningToast("something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createDeploymentJobs = (deploymentJobsData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  const data = {
    image_size: deploymentJobsData.imageSize,
    confidence_threshold: deploymentJobsData.confidenceThreshold,
    iou_threshold: deploymentJobsData.iouThreshold,
    model_id: deploymentJobsData.modelId,
    deployment_type_id: deploymentJobsData.deploymentTypeId,
    status: deploymentJobsData.status,
    user_id: deploymentJobsData.userId,
  };
  return addNewDeploymentJobsDetails(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentJobsCreated(response.data));
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

export const fetchDeploymentJobById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getDeploymentJobDetailsById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentJobsFetchedById(response.data));
      } else {
        throw new Error("Error getting deployment job details");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const startDeploymentJobById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return startDeploymentJob(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.updateDeployedJobDetails(id));
      } else {
        throw new Error("Error while deploying job");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
