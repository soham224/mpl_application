import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { DeploymentRTSPJobNewDialogHeader } from "./DeploymentRTSPJobNewDialogHeader";
import { DeploymentRTSPJobNewForm } from "./DeploymentRTSPJobNewForm";
import * as action from "../../../../_redux/DeploymentRTSPJobs/DeploymentRTSPJobsAction";
import { SavingDetailsModal } from "../../../../../../../../utils/SavingDetailsModal";

export function DeploymentRTSPJobNewDialog({ show, onHide }) {
  const { actionsLoading } = useSelector(
    state => ({
      actionsLoading: state.deploymentRTSPJobs.actionsLoading
    }),
    shallowEqual
  );

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const saveDeploymentRTSPJob = deploymentType => {
    // server request for creating deploymentType
    setLoading(true);
    dispatch(action.createDeploymentRTSPJobs(deploymentType)).then(() =>
      onHide()
    );
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <SavingDetailsModal show={loading} />
      <DeploymentRTSPJobNewDialogHeader />
      <DeploymentRTSPJobNewForm
        saveDeploymentRTSPJob={saveDeploymentRTSPJob}
        actionsLoading={actionsLoading}
        onHide={onHide}
      />
    </Modal>
  );
}
