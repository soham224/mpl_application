import React, { Suspense } from "react";
import { DeployedRTSPJobsPage } from "./DeployedRTSPJobTable/DeployedRTSPJobsPage";

import {
  ContentRoute,
  LayoutSplashScreen
} from "../../../../../../_metronic/layout";
import { Switch } from "react-router-dom";

export default function DeployedRTSPJobs({ setKey }) {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute
          path="/deployedDetails/deployedRTSPJobsPage"
          children={<DeployedRTSPJobsPage setKey={setKey} />}
        />
      </Switch>
    </Suspense>
  );
}
