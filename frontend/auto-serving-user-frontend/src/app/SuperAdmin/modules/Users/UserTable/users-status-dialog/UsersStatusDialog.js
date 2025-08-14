import React, { useState } from "react";
import * as actions from "../../_redux/UserAction";
import { useDispatch } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";

export function UsersStatusDialog({ id, status, show, onHide }) {
  const initTitle = "Are you sure? to change status";
  const [alertData, setAlertData] = useState({
    loading: false,
    success: false,
    alertTitle: initTitle,
  });

  function refreshPage() {
    window.location.reload(false);
  }
  const dispatch = useDispatch();
  const confirmSubmitData = () => {
    setAlertData({
      ...alertData,
      loading: true,
      alertTitle: "Updating Status!",
    });
    dispatch(actions.changeUserStatus(id, status)).then(() => {
      setAlertData({
        loading: false,
        success: true,
        alertTitle: "Status Updated Successfully!",
      });
      setTimeout(() => {
        setAlertData({ ...alertData, success: false, alertTitle: initTitle });
        onHide();
        refreshPage();
      }, 800);
    });
  };

  const { success, loading, alertTitle } = alertData;

  return (
    <SweetAlert
      info={!success}
      success={success}
      showCancel={!loading && !success}
      showConfirm={!loading && !success}
      closeOnClickOutside={!loading}
      confirmBtnText="Confirm"
      confirmBtnBsStyle="primary"
      cancelBtnBsStyle="light"
      cancelBtnStyle={{ color: "black" }}
      title={alertTitle}
      onConfirm={confirmSubmitData}
      onCancel={onHide}
      show={show}
      focusCancelBtn
      dependencies={[loading]}
    >
      {loading ? (
        <div className="overlay-layer bg-transparent">
          <div className="spinner-border text-info text-center" />
        </div>
      ) : (
        <></>
      )}
    </SweetAlert>
  );
}
