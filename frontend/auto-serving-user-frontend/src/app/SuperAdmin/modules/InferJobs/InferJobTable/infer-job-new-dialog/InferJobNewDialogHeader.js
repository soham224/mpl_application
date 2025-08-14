import React from "react";
import { Modal } from "react-bootstrap";

export function InferJobNewDialogHeader() {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Add Infer Jobs
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
