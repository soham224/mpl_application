import { MyResultSlice1 } from "./MyResultSlice";
import { warningToast } from "../../../../../utils/ToastMessage";
import { updateResultsStatus } from "./my-result";

const { actions } = MyResultSlice1;

export const changeResultStatus = (id, status) => (dispatch) => {
  return updateResultsStatus(id, status)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.reloadResults(response.data));
      } else {
        warningToast("Error updating result status");
      }
    })
    .catch((error) => {
      warningToast("Something went wrong!");
    });
};

export const setMyResults = (myResults) => (dispatch) => {
  dispatch(actions.setEntities(myResults));
};
