import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import * as action from "../../_redux/FrameworkDetailsAction";

export function FrameworkDetailsStatusDialog({
  id,
  status,
  show,
  onHide,
  isDeprecatedStatus,
}) {
  const dispatch = useDispatch();
  const { entities } = useSelector(
    (state) => ({
      actionsLoading: state.frameworkDetails.actionsLoading,
      entities: state.frameworkDetails.entities,
    }),
    shallowEqual
  );

  const initialTitle = "Are you sure? to change status";
  const [alertData, setAlertData] = useState({
    loading: false,
    success: false,
    alertTitle: initialTitle,
  });

  const confirmSubmitData = () => {
    setAlertData({
      ...alertData,
      loading: true,
      alertTitle: "Changing Status",
    });
    let frameworkData = { ...entities.filter((d) => d.id === id * 1)[0] };

    if (isDeprecatedStatus === "true") {
      frameworkData.is_deprecated = status;
    } else {
      frameworkData.status = status;
    }
    dispatch(action.frameworkDetailsUpdate(frameworkData)).then(() => {
      setAlertData({
        loading: false,
        success: true,
        alertTitle: "Status Changed Successfully!",
      });
      setTimeout(() => {
        setAlertData({
          ...alertData,
          success: false,
          alertTitle: initialTitle,
        });
        onHide();
      }, 800);
    });
  };

  const { success, loading, alertTitle } = alertData;

  return (
    <>
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
      ;
    </>
  );
}
