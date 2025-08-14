import { AiModelSlice, callTypes } from "./AiModelSlice";
import {
  getAIModelById,
  getAllAIModel,
  getAllDevice,
  getDeviceById,
  saveAIModel,
  updateAIModel,
} from "./ai-model-api";
import {
  getAllFrameworkDetails,
  getFrameworkDetailsById,
} from "../../FrameworkDetails/_redux/framework.api";
import {
  getAllModelType,
  getModelTypeById,
} from "../../ModelType/_redux/modelType.api";
import { successToast } from "../../../../../utils/ToastMessage";
const { actions } = AiModelSlice;

export const fetchAIModel = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllAIModel()
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(actions.aiModelFetched(data));
        dispatch(actions.aiModelFilter(data));

        let aiModelData =
          data &&
          data.map((items) => {
            return { value: items.id, label: items.model_name };
          });
        dispatch(actions.fetchAIModelDetails(aiModelData));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAIModelById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getAIModelById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(fetchDevice());
        dispatch(fetchModelType());
        dispatch(fetchFramework());
        dispatch(actions.aiModelFetchedById(data));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchAIModelViewDetails = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getAIModelById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        let deviceId = response.data.model_device_id;
        let modelTypeId = response.data.model_type_id;
        let modelFrameworkId = response.data.model_framework_id;
        dispatch(fetchDeviceDetails(deviceId));
        dispatch(fetchModelTypeDetails(modelTypeId));
        dispatch(fetchFrameworkDetails(modelFrameworkId));
        dispatch(actions.fetchAIModelViewDetails(data));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

const fetchDeviceDetails = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getDeviceById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(actions.fetchDeviceViewDetails(data));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

const fetchModelTypeDetails = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getModelTypeById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(actions.fetchModelTypeViewDetails(data));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
const fetchFrameworkDetails = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getFrameworkDetailsById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(actions.fetchFrameworkViewDetails(data));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchDevice = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return getAllDevice()
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;

        let deviceData =
          data &&
          data.map((items) => {
            return { value: items.id, label: items.device_name };
          });

        dispatch(actions.fetchDeviceDetails(deviceData));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchModelType = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return getAllModelType()
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        let modelTypeData =
          data &&
          data.map((items) => {
            return { value: items.id, label: items.model_type_name };
          });
        dispatch(actions.fetchModelTypeDetails(modelTypeData));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchFramework = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return getAllFrameworkDetails()
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        let frameworkData =
          data &&
          data.map((items) => {
            return { value: items.id, label: items.framework_name };
          });
        dispatch(actions.fetchFrameworkDetails(frameworkData));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const saveAIModelData = (aiModelData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  const data = {
    model_name: aiModelData.modelName,
    model_description: aiModelData.modelDescription,
    model_cpu_infer_speed: aiModelData.modelCpuInferSpeed,
    model_gpu_infer_speed: aiModelData.modelGpuInferSpeed,
    model_version_id: aiModelData.modelVersionId,
    model_accuracy: aiModelData.modelAccuracy,
    framework_version_number: aiModelData.frameworkVersionNumber,
    model_type_id: aiModelData.modelTypeId.value,
    model_device_id: aiModelData.modelDeviceId.value,
    model_size: aiModelData.modelSize,
    model_depth: aiModelData.modelDepth,
    model_framework_id: aiModelData.modelFrameworkId.value,
    status: false,
    model_id: aiModelData.modelId,
  };

  return saveAIModel(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.aiModelCreated(response));
        successToast("AI Model Added Successfully");
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateAIModelData = (aiModelData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    model_name: aiModelData.modelName || aiModelData.model_name,
    model_description:
      aiModelData.modelDescription || aiModelData.model_description,
    model_cpu_infer_speed:
      aiModelData.modelCpuInferSpeed || aiModelData.model_cpu_infer_speed,
    model_gpu_infer_speed:
      aiModelData.modelGpuInferSpeed || aiModelData.model_gpu_infer_speed,
    model_version_id:
      aiModelData.modelVersionId || aiModelData.model_version_id,
    model_accuracy: aiModelData.modelAccuracy || aiModelData.model_accuracy,
    framework_version_number:
      aiModelData.frameworkVersionNumber ||
      aiModelData.framework_version_number,
    model_type_id: aiModelData.modelTypeId?.value || aiModelData.model_type_id,
    model_device_id:
      aiModelData.modelDeviceId?.value || aiModelData.model_device_id,
    model_size: aiModelData.modelSize || aiModelData.model_size,
    model_depth: aiModelData.modelDepth || aiModelData.model_depth,
    model_framework_id:
      aiModelData.modelFrameworkId?.value || aiModelData.model_framework_id,
    status: aiModelData.status || false,
    id: aiModelData.modelId || aiModelData.id,
  };

  return updateAIModel(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.aiModelUpdated(response.data));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
