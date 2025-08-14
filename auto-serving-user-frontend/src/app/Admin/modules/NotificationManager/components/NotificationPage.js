import { Route } from "react-router-dom";
import React from "react";
import { NotificationManagerCard } from "./NotificationManagerCard";
import { NotificationManagerEditDialog } from "./notification-manager-details-edit-dialog/NotificationManagerEditDialog";
import { ADMIN_URL } from "../../../../../enums/constant";
import {NotificationManagerUIProvider} from "./NotificationManagerUIContext";

export function NotificationManagerPage({ history }) {
  const notificationManagerPageBaseUrl = "/notification-manager";

  const notificationManagerPageBaseUrlUIEvents = {
    newNotificationManagerBtnClick: () => {
      history.push(`${notificationManagerPageBaseUrl}/new`);
    },
    changeStatusNotificationManagerBtnClick: (id, status, isDeprecatedStatus) => {
      history.push(
        `${notificationManagerPageBaseUrl}/${id}/${status}/${isDeprecatedStatus}/changeStatus`
      );
    },
    editNotificationManagerBtnClick: (id) => {
      history.push(`${notificationManagerPageBaseUrl}/${id}/edit`);
    },
  };
    console.log("NotificationManagerPage")

  return (
    <NotificationManagerUIProvider notificationManagerPageBaseUrlUIEvents={notificationManagerPageBaseUrlUIEvents}>
      <Route path={`${notificationManagerPageBaseUrl}/new`}>
        {({ history, match }) => (
          <NotificationManagerEditDialog
            show={match != null}
            onHide={() => {
              history.push(notificationManagerPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${notificationManagerPageBaseUrl}/:id/edit`}>
        {({ history, match }) => (
          <NotificationManagerEditDialog
            show={match != null}
            id={match?.params.id}
            onHide={() => {
              history.push(notificationManagerPageBaseUrl);
            }}
          />
        )}
      </Route>
      <NotificationManagerCard />
    </NotificationManagerUIProvider>
  );
}
