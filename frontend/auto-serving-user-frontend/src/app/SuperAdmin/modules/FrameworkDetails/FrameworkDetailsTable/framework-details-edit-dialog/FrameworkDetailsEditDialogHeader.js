import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";

export function FrameworkDetailsEditDialogHeader({ id }) {
  const { actionsLoading } = useSelector(
    (state) => ({
      actionsLoading: state.modelType.actionsLoading,
    }),
    shallowEqual
  );

  const [titlePrefix, setTitlePrefix] = useState("");
  useEffect(() => {
    setTitlePrefix(id ? "Edit" : "Add New");
    //eslint-disable-next-line
  }, [actionsLoading]);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {titlePrefix} Framework Details
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
