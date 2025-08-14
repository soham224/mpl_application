import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {NotificationNotificationManagerPage} from "../NotificationPage";

export function NotificationManagerEditDialogHeader({ id }) {
  const { actionsLoading } = useSelector(
    state => ({
      actionsLoading: state.notificationManager.actionsLoading
    }),
    shallowEqual
  );

  const [titlePrefix, setTitlePrefix] = useState("");
  useEffect(() => {
    setTitlePrefix(id ? "Edit" : "Add New");
    // eslint-disable-next-line
  }, [actionsLoading]);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {titlePrefix} Notification
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
