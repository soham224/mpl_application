import { ModelBannerImageSlice, callTypes } from "./ModelBannerImageSlice";
import { AuthAction } from "../../../Auth/_redux/authRedux";
import { saveModelBannerImage } from "./modelBannerImage.api";
import { successToast } from "../../../../../../utils/ToastMessage";

const { actions } = ModelBannerImageSlice;

export const saveModelBannerImageData =
  (modelBannerImageData, id) => (dispatch) => {
    dispatch(actions.startCall({ callType: callTypes.list }));

    let formData = new FormData();
    formData.append("image", modelBannerImageData.image);
    formData.append("model_id", id);

    return saveModelBannerImage(formData)
      .then((response) => {
        if (response && response.isSuccess) {
          dispatch(actions.modelBannerImageCreated());
          successToast("Model Banner Image Added Successfully");
        }
      })
      .catch((error) => {
        if (error.request.status === 401) {
          dispatch(AuthAction.logout());
        }
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  };
