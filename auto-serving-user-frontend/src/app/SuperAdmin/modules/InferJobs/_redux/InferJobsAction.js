import { callTypes, InferJobsSlice } from "./InferJobsSlice";
import { successToast, warningToast } from "../../../../../utils/ToastMessage";
import {
  addNewInferJobsDetails,
  getAllInferJobsDetails,
  getInferJobDetailsById,
} from "./inferJobs.api";

const { actions } = InferJobsSlice;

export const fetchInferJobs = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllInferJobsDetails()
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.inferJobsFetched(response.data));
      } else {
        warningToast("something went wrong");
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find infer jobs";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createInferJobs = (inferJobsData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  const data = {
    image_size: inferJobsData.imageSize,
    confidence_threshold: inferJobsData.confidenceThreshold,
    iou_threshold: inferJobsData.iouThreshold,
    model_id: inferJobsData.modelId,
    status: inferJobsData.status,
    user_id: inferJobsData.userId,
  };
  return addNewInferJobsDetails(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.inferJobsCreated(response.data));
        successToast("Infer Job Added Successfully");
      } else {
        throw new Error("something went wrong");
      }
    })
    .catch((error) => {
      warningToast("something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchInferJobById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return getInferJobDetailsById(id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.inferJobsFetchedById(response.data));
      } else {
        throw new Error("Error getting infer job details");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong");
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
