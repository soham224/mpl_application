import { ModelResultImageSlice, callTypes } from "./ModelResultImageSlice";
import { AuthAction } from "../../../Auth/_redux/authRedux";
import { saveModelResultImage } from "./modelResultImage.api";
import { successToast } from "../../../../../../utils/ToastMessage";

const { actions } = ModelResultImageSlice;

export const saveModelResultImageData =
  (modelResultImageData, id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));

    let formData = new FormData();
    formData.append("image", modelResultImageData.image);
    formData.append("model_id", id);

    return saveModelResultImage(formData)
      .then((response) => {
        if (response && response.isSuccess) {
          dispatch(actions.modelResultImageCreated());
          successToast("Model Result Image Added Successfully");
        }
      })
      .catch((error) => {
        if (error.request.status === 401) {
          dispatch(AuthAction.logout());
        }
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  };
