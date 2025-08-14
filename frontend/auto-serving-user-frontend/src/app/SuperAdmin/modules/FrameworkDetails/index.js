import React, { Suspense } from "react";
import { FrameworkDetailsPage } from "./FrameworkDetailsTable/FrameworkDetailsPage";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Redirect, Switch } from "react-router-dom";

export default function FrameworkDetails() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from frameworkDetails root URL to /frameworkDetails/frameworkDetailsPage */
          <Redirect
            exact={true}
            from="/frameworkDetails"
            to="/frameworkDetails/frameworkDetailsPage"
          />
        }
        <ContentRoute
          path="/frameworkDetails/frameworkDetailsPage"
          component={FrameworkDetailsPage}
        />
      </Switch>
    </Suspense>
  );
}
