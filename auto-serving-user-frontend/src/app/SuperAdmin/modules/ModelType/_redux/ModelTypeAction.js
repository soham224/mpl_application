import { callTypes, ModelTypeSlice } from "./ModelTypeSlice";
import { successToast, warningToast } from "../../../../../utils/ToastMessage";
import {
  addNewModelType,
  getAllModelType,
  getModelTypeById,
  updateModelType,
} from "./modelType.api";

const { actions } = ModelTypeSlice;

export const fetchModelTypes = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllModelType()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.modelTypeFetched(response.data));
      } else {
        warningToast("something went wrong");
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find model types";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createModelType = (modelTypeData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  const data = {
    model_type_name: modelTypeData.modelTypeName,
    model_type_description: modelTypeData.modelTypeDescription,
    status: modelTypeData.status,
  };
  return addNewModelType(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.modelTypeCreated(response.data));
        successToast("Model Type Added Successfully");
      } else {
        throw new Error("something went wrong");
      }
    })
    .catch((error) => {
      warningToast("something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchModelTypeById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getModelTypeById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.modelTypeFetchedById(response.data));
      } else {
        throw new Error("Error getting model type details");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const modelTypeUpdate = (modelTypeData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    model_type_name:
      modelTypeData.modelTypeName || modelTypeData.model_type_name,
    model_type_description:
      modelTypeData.modelTypeDescription ||
      modelTypeData.model_type_description,
    status: modelTypeData.status,
    id: modelTypeData.id,
  };

  return updateModelType(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.modelTypeUpdated(response.data));
      } else {
        throw new Error("Error updating model type details");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
