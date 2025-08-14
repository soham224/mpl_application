import React from "react";
import { Modal } from "react-bootstrap";

export function DeploymentRTSPJobNewDialogHeader() {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Add Deployment RTSP jobs
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
