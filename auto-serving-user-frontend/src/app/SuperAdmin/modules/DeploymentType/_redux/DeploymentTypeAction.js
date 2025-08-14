import { callTypes, DeploymentTypeSlice } from "./DeploymentTypeSlice";
import { successToast, warningToast } from "../../../../../utils/ToastMessage";
import {
  addNewDeploymentType,
  getAllDeploymentType,
  getDeploymentTypeById,
  updateDeploymentType,
} from "./deploymentType.api";

const { actions } = DeploymentTypeSlice;

export const fetchDeploymentTypes = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllDeploymentType()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentTypeFetched(response.data));
      } else {
        warningToast("something went wrong");
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find deployment types";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createDeploymentType = (deploymentTypeData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  const data = {
    deployment_type_name: deploymentTypeData.deploymentTypeName,
    deployment_type_description: deploymentTypeData.deploymentTypeDescription,
    status: deploymentTypeData.status,
  };
  return addNewDeploymentType(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentTypeCreated(response.data));
        successToast("Deployment Type Added Successfully");
      } else {
        throw new Error("something went wrong");
      }
    })
    .catch((error) => {
      warningToast("something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchDeploymentTypeById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getDeploymentTypeById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentTypeFetchedById(response.data));
      } else {
        throw new Error("Error getting deployment type details");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deploymentTypeUpdate = (deploymentTypeData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    deployment_type_name:
      deploymentTypeData.deploymentTypeName ||
      deploymentTypeData.deployment_type_name,
    deployment_type_description:
      deploymentTypeData.deploymentTypeDescription ||
      deploymentTypeData.deployment_type_description,
    status: deploymentTypeData.status,
    id: deploymentTypeData.id,
  };

  return updateDeploymentType(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.deploymentTypeUpdated(response.data));
      } else {
        throw new Error("Error updating deployment type details");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
