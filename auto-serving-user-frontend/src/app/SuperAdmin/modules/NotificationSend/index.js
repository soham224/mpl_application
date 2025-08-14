import React, { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Switch } from "react-router-dom";
import {NotificationSendPage} from "./components/NotificationSendPage";

export default function NotificationSend() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute
          path={"/NotificationSend"}
          component={NotificationSendPage}
        />
      </Switch>
    </Suspense>
  );
}
