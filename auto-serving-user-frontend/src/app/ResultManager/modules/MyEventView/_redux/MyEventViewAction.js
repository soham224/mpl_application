import { MyResultSliceResultManager } from "./MyEventViewSlice";
import { updateEventsStatusResultManager } from "./MyEventViewApi";
import { warningToast } from "../../../../../utils/ToastMessage";

const { actions } = MyResultSliceResultManager;

export const changeEventStatus = (id, status) => dispatch => {
  return updateEventsStatusResultManager(id, status)
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
