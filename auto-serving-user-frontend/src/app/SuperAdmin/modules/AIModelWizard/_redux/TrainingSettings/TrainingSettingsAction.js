import { callTypes, TrainingSettingsSlice } from "./TrainingSettingsSlice";
import { AuthAction } from "../../../Auth/_redux/authRedux";
import { saveTrainingSettings } from "./trainingSettings.api";
import { successToast } from "../../../../../../utils/ToastMessage";

const { actions } = TrainingSettingsSlice;

export const saveTrainingSettingsData =
  (trainingSettingsData, id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));

    const data = {
      image_size: trainingSettingsData.imageSize,
      model_training_batch_size: trainingSettingsData.modelTrainingBatchSize,
      batch_size: trainingSettingsData.batchSize,
      model_epochs: trainingSettingsData.modelEpochs,
      model_labels_list: trainingSettingsData.modelLabelsList,
      status: false,
      model_id: id,
    };

    return saveTrainingSettings(data)
      .then((response) => {
        if (response && response.isSuccess) {
          dispatch(actions.trainingSettingsCreated());
          successToast("Training Settings Added Successfully");
        }
      })
      .catch((error) => {
        if (error.request.status === 401) {
          dispatch(AuthAction.logout());
        }
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  };
