import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";

export function UsersEditDialogHeader({ id }) {
  // Customers Redux state
  /*const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
        userForEdit: state.users.userForEdit,
      actionsLoading: state.users.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New User";
    // if (userForEdit && id) {
    //   _title = `Edit user '${userForEdit.firstName} ${userForEdit.lastName}'`;
    // }

    setTitle(_title);
    // eslint-disable-next-line
  }, [userForEdit, actionsLoading]);
*/
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">Add S3 Data Handler</Modal.Title>
      </Modal.Header>
    </>
  );
}
