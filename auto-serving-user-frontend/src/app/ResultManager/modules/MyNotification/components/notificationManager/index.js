import React, { Suspense } from "react";

import {
  ContentRoute,
  LayoutSplashScreen,
} from "../../../../../../_metronic/layout";
import { Switch } from "react-router-dom";
import { MyNotificationViewPage} from "./MyNotificationViewTable/MyNotificationViewPage";

export default function NotificationAlert() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path={"/notificationAlert"} component={MyNotificationViewPage} />
      </Switch>
    </Suspense>
  );
}
