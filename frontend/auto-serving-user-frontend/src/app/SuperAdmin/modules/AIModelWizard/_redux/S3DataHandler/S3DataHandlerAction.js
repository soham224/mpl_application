import { S3DataHandlerSlice, callTypes } from "./S3DataHandlerSlice";
import { AuthAction } from "../../../Auth/_redux/authRedux";
import { saveS3DataHandler } from "./s3DataHandler.api";
import { successToast } from "../../../../../../utils/ToastMessage";

const { actions } = S3DataHandlerSlice;

export const saveS3DataHandlerData = (S3DataHandlerData, id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  const data = {
    model_s3_url: S3DataHandlerData.modelS3Url,
    model_s3_key: S3DataHandlerData.modelS3Key,
    model_s3_name: S3DataHandlerData.modelS3Name,
    model_version: S3DataHandlerData.modelVersion,
    status: false,
    model_id: id,
  };

  return saveS3DataHandler(data)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.s3DataHandlerCreated());
        successToast("S3 Data Handler Added Successfully");
      }
    })
    .catch((error) => {
      if (error.request.status === 401) {
        dispatch(AuthAction.logout());
      }
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
