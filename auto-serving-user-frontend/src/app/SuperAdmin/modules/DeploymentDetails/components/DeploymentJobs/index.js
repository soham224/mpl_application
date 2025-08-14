import React, { Suspense } from "react";
import { DeploymentJobsPage } from "./DeploymentJobTable/DeploymentJobsPage";

import {
  ContentRoute,
  LayoutSplashScreen
} from "../../../../../../_metronic/layout";
import { Redirect, Switch } from "react-router-dom";

export default function DeploymentJobs({ setKey }) {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from /deploymentJobs root URL to /deploymentJobs/deploymentJobsPage */
          <Redirect
            exact={true}
            from="/deploymentDetails"
            to="/deploymentDetails/deploymentJobsPage"
          />
        }
        <ContentRoute
          path="/deploymentDetails/deploymentJobsPage"
          children={<DeploymentJobsPage setKey={setKey} />}
        />
      </Switch>
    </Suspense>
  );
}
