import { callTypes, UserSlice } from "./UserSlice";
import { successToast } from "../../../../../utils/ToastMessage";
import {
  addCompany,
  getAllUsers,
  saveUser,
  updateUserStatus,
} from "./users.api";

const { actions } = UserSlice;

export const fetchUsers = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return getAllUsers()
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;

        dispatch(actions.userFetched(data));
        dispatch(actions.userFilter(data));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createCompany = (userData) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  const data = {
    company_email: userData.companyEmail,
    company_name: userData.companyName,
    company_description: userData.companyDescription,
    company_address: userData.companyAddress,
    company_pin_code: userData.companyPinCode,
    company_website: userData.companyWebsite,
    company_contact: userData.companyContact,
    company_poc: userData.companyPoc,
    company_poc_contact: userData.companyPocContact,
    company_status: userData.status,
    deployment_region: "Mumbai",
  };

  return addCompany(data)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;
        dispatch(createUser(userData, data.id));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createUser = (userData, companyId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  const data = {
    user_email: userData.userEmail,
    user_status: true,
    company_id: companyId,
    user_password: userData.userPassword,
  };

  return saveUser(data)
    .then((response) => {
      if (response && response.isSuccess) {
        let data = response.data;

        dispatch(actions.userCreated(data));
        // dispatch(fetchUsers());
        successToast("User Added Successfully");
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const changeUserStatus = (id, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return updateUserStatus(status, id)
    .then((response) => {
      if (response && response.isSuccess) {
        dispatch(actions.userStatusChanged({ status, id }));
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
