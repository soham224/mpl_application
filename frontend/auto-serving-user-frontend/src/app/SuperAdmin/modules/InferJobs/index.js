import React, { Suspense } from "react";
import { InferJobsPage } from "./InferJobTable/InferJobsPage";

import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Redirect, Switch } from "react-router-dom";

export default function InferJobs() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from /inferJobs root URL to /inferJobs/inferJobsPage */
          <Redirect
            exact={true}
            from="/inferJobs"
            to="/inferJobs/inferJobsPage"
          />
        }
        <ContentRoute
          path="/inferJobs/inferJobsPage"
          component={InferJobsPage}
        />
      </Switch>
    </Suspense>
  );
}
