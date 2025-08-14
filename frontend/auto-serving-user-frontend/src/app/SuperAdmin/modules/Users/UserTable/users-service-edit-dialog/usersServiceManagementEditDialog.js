import React from "react";
import { Modal } from "react-bootstrap";
import { UsersServiceManagementEditDialogHeader } from "./usersServiceManagementEditDialogHeader";
import { UsersServiceManagementEditForm } from "./usersServiceManagementEditForm";

export function UsersServiceManagementEditDialog({ show, onHide }) {
  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-xl"
    >
      <UsersServiceManagementEditDialogHeader />
      <UsersServiceManagementEditForm onHide={onHide} />
    </Modal>
  );
}
