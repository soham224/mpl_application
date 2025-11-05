import React, { Suspense } from "react";
import { DeploymentRTSPJobsPage } from "./DeploymentRTSPJobTable/DeploymentRTSPJobsPage";

import {
  ContentRoute,
  LayoutSplashScreen
} from "../../../../../../_metronic/layout";
import { Switch } from "react-router-dom";

export default function DeploymentRTSPJobs({ setKey }) {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute
          path="/deploymentDetails/deploymentRTSPJobsPage"
          children={<DeploymentRTSPJobsPage setKey={setKey} />}
        />
      </Switch>
    </Suspense>
  );
}
