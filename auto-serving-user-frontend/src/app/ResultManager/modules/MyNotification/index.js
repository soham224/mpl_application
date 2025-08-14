import React from "react";
import { useSubheader } from "../../../../_metronic/layout";
import NotificationAlert from "./components/notificationManager";

export function MyNotificationView() {
  const subheader = useSubheader();
  subheader.setTitle("Notification");

  return <NotificationAlert />;
}
