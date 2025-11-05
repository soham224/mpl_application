import React, { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Switch } from "react-router-dom";
import { ADMIN_URL } from "../../../../enums/constant";
import {NotificationManagerPage} from "./components/NotificationPage";

export default function NotificationManager() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute
          path={"/notification-manager"}
          component={NotificationManagerPage}
        />
      </Switch>
    </Suspense>
  );
}
