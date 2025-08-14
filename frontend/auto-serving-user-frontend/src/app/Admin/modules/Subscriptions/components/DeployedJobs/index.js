import React, { Suspense } from "react";

import {
  ContentRoute,
  LayoutSplashScreen,
} from "../../../../../../_metronic/layout";
import { DeployedJobsPage } from "./DeployedJobTable/DeployedJobsPage";
import { ADMIN_URL } from "../../../../../../enums/constant";

export default function DeployedJobs({ setKey }) {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <ContentRoute
        path={ADMIN_URL + "/subscriptions/deployedJobsPage"}
        children={<DeployedJobsPage setKey={setKey} />}
      />
    </Suspense>
  );
}
