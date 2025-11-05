import {
  ContentRoute,
  LayoutSplashScreen,
  useSubheader,
} from "../../../_metronic/layout";
import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import SecurityPage from "../../SecurityManager";

export function Security() {
  const subheader = useSubheader();
  subheader.setTitle("Security");

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute
          path="/dashboard"
          component={SecurityPage}
        />
      </Switch>
    </Suspense>
  );
}
