import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";

export function DeploymentTypeEditDialogHeader({ id }) {
  const { actionsLoading } = useSelector(
    state => ({
      actionsLoading: state.deploymentType.actionsLoading
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
          {titlePrefix} Deployment Type
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
