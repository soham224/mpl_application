import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { InferJobNewDialogHeader } from "./InferJobNewDialogHeader";
import { InferJobNewForm } from "./InferJobNewForm";
import * as action from "../../_redux/InferJobsAction";
import { SavingDetailsModal } from "../../../../../../utils/SavingDetailsModal";

export function InferJobNewDialog({ show, onHide }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const saveInferJob = (deploymentType) => {
    setLoading(true);
    // server request for creating deploymentType
    dispatch(action.createInferJobs(deploymentType)).then(() => onHide());
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <SavingDetailsModal show={loading} />
      <InferJobNewDialogHeader />
      <InferJobNewForm saveInferJob={saveInferJob} onHide={onHide} />
    </Modal>
  );
}
