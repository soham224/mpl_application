import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/UserAction";
import { UsersEditDialogHeader } from "./UsersEditDialogHeader";
import { UsersEditForm } from "./UsersEditForm";
import { SavingDetailsModal } from "../../../../../../utils/SavingDetailsModal";

export function UsersEditDialog({ id, show, onHide }) {
  const { actionsLoading } = useSelector(
    (state) => ({
      actionsLoading: state.users.actionsLoading,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // server request for saving user
  const saveUser = (user) => {
    setLoading(true);
    if (!id) {
      // server request for creating user
      dispatch(actions.createCompany(user)).then(() => {
        setLoading(false);
        onHide();
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <SavingDetailsModal show={loading} />
      <UsersEditDialogHeader id={id} />
      <UsersEditForm
        saveUser={saveUser}
        actionsLoading={actionsLoading}
        onHide={onHide}
      />
    </Modal>
  );
}
