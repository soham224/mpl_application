import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { DeploymentJobNewDialogHeader } from "./DeploymentJobNewDialogHeader";
import { DeploymentJobNewForm } from "./DeploymentJobNewForm";
import * as action from "../../../../_redux/DeploymentJobs/DeploymentJobsAction";
import { SavingDetailsModal } from "../../../../../../../../utils/SavingDetailsModal";

export function DeploymentJobNewDialog({ show, onHide }) {
  const { actionsLoading } = useSelector(
    state => ({
      actionsLoading: state.deploymentJobs.actionsLoading
    }),
    shallowEqual
  );

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const saveDeploymentJob = deploymentType => {
    // server request for creating deploymentType
    setLoading(true);
    dispatch(action.createDeploymentJobs(deploymentType)).then(() => onHide());
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <SavingDetailsModal show={loading} />
      <DeploymentJobNewDialogHeader />
      <DeploymentJobNewForm
        saveDeploymentJob={saveDeploymentJob}
        actionsLoading={actionsLoading}
        onHide={onHide}
      />
    </Modal>
  );
}
