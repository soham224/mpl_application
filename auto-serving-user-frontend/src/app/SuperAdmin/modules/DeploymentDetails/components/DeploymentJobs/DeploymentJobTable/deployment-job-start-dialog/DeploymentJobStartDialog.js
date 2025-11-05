import React, { useState } from "react";
import { useDispatch } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import * as action from "../../../../_redux/DeploymentJobs/DeploymentJobsAction";

export function DeploymentJobStartDialog({ id, show, onHide }) {
  const dispatch = useDispatch();
  const initialTitle = "Are you sure? to deploy";
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertTitle, setAlertTitle] = useState(initialTitle);
  const confirmSubmitData = () => {
    setLoading(true);
    setAlertTitle("Deploying");
    dispatch(action.startDeploymentJobById(id)).then(() => {
      setLoading(false);
      setSuccess(true);
      setAlertTitle("Deployed");
      setTimeout(() => {
        setSuccess(false);
        setAlertTitle(initialTitle);
        onHide();
      }, 750);
    });
  };

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
        onConfirm={() => confirmSubmitData()}
        onCancel={onHide}
        show={show}
        focusCancelBtn
        dependencies={[loading]}
      >
        {loading ? (
          <div className="overlay-layer bg-transparent text-center mt-5">
            <div className="spinner-border text-info text-center" />
          </div>
        ) : (
          <></>
        )}
      </SweetAlert>
    </>
  );
}
