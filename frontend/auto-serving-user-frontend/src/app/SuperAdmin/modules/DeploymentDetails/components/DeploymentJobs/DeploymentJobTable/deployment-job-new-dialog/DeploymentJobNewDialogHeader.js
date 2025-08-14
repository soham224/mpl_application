import React from "react";
import { Modal } from "react-bootstrap";

export function DeploymentJobNewDialogHeader() {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Add Deployment Jobs
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
