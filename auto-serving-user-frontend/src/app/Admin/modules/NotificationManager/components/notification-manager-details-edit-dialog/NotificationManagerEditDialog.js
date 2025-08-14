import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { NotificationManagerEditDialogHeader } from "./NotificationManagerEditDialogHeader";
import { NotificationManagerEditForm } from "./NotificationManagerEditForm";
import * as action from "../../_redux/NotificationManagerAction";
import { NotificationManagerSlice } from "../../_redux/NotificationManagerSlice";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

const { actions } = NotificationManagerSlice;

export function NotificationManagerEditDialog({ id, show, onHide }) {
  const { actionsLoading, fetchEmailById } = useSelector(
    (state) => ({
      actionsLoading: state.notificationManager.actionsLoading,
      fetchEmailById: state.notificationManager.fetchEmailById,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== null && id !== undefined) {
      dispatch(action.fetchEmailById(id));
    } else {
      dispatch(actions.clearNotificationById());
    }
  }, [id, dispatch]);


  const saveNotificationDetails = (notification) => {
    const data={
      email: notification?.email
    }
    const updateData={
      email: notification?.email,
      id:notification?.id
    }
    if (!id) {
      dispatch(action.createEmail(data)).then(() => {
        dispatch(action.fetchEmail());
        onHide();
      });
    } else {
      dispatch(action.emailUpdate(updateData)).then(() => {
        dispatch(action.fetchEmail());
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
      <NotificationManagerEditDialogHeader id={id} />
      <BlockUi tag="div" blocking={actionsLoading} color="#147b82">
        <NotificationManagerEditForm
            saveNotification={saveNotificationDetails}
          actionsLoading={actionsLoading}
            notificationData={fetchEmailById}
          onHide={onHide}
        />
      </BlockUi>
    </Modal>
  );
}
