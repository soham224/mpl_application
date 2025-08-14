import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useAIModelUIContext } from "../ViewAIModelUIContext";
import { AIModelDetailsForm } from "./AIModelDetailsForm";
import * as actions from "../../../../_redux/AiModelAction";

export function AIModelDetailsDialog({ id, show, onHide }) {
  const aiModelUIContext = useAIModelUIContext();

  // Customers Redux state
  const dispatch = useDispatch();
  const {
    actionsLoading,
    aiModelViewDetails,
    deviceViewDetails,
    modelTypeViewDetails,
    frameworkViewDetails,
  } = useSelector(
    (state) => ({
      actionsLoading: state.aiModel.actionsLoading,
      aiModelViewDetails: state.aiModel.aiModelViewDetails,
      deviceViewDetails: state.aiModel.deviceViewDetails,
      modelTypeViewDetails: state.aiModel.modelTypeViewDetails,
      frameworkViewDetails: state.aiModel.frameworkViewDetails,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (id != null) {
      dispatch(actions.fetchAIModelViewDetails(id));
    }
  }, [id, dispatch]);

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          User Details
        </Modal.Title>
      </Modal.Header>
      <AIModelDetailsForm
        actionsLoading={actionsLoading}
        aiModelViewDetails={aiModelViewDetails || aiModelUIContext.initUser}
        frameworkViewDetails={frameworkViewDetails}
        deviceViewDetails={deviceViewDetails}
        modelTypeViewDetails={modelTypeViewDetails}
        onHide={onHide}
      />
    </Modal>
  );
}
