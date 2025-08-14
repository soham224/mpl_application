import { MyResultSliceResultManager } from "./MyResultSlice";
import {
  saveResultManager,
  updateResultsStatusResultManager
} from "./MyResultApi";
import { warningToast } from "../../../../../utils/ToastMessage";

const { actions } = MyResultSliceResultManager;

export const changeResultStatus = (id, status) => dispatch => {
  return updateResultsStatusResultManager(id, status)
    .then(response => {
      if (response && response.isSuccess) {
      } else {
        warningToast("Error updating result status");
      }
    })
    .catch(error => {
      warningToast("Something went wrong!");
    });
};
export const setMyResults = myResults => dispatch => {
  dispatch(actions.setEntities(myResults));
};
export const saveResults = (data, id) => dispatch => {
  return saveResultManager(data, id)
    .then(response => {
      if (response && response.isSuccess) {
        // dispatch(actions.reloadResults(response.data));
      } else {
        warningToast("Error updating result status");
      }
    })
    .catch(error => {
      warningToast("Something went wrong!");
    });
};
