import React from "react";
import { Modal } from "react-bootstrap";

export function UsersEditDialogHeader() {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Add User</Modal.Title>
      </Modal.Header>
    </>
  );
}
