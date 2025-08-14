import React, { Suspense } from "react";

import {
  ContentRoute,
  LayoutSplashScreen,
} from "../../../../../../_metronic/layout";
import { Switch } from "react-router-dom";
import { MyEventViewPage } from "./MyEventViewTable/MyEventViewPage";

export default function DeployedRTSPJobs() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path={"/eventsList"} component={MyEventViewPage} />
      </Switch>
    </Suspense>
  );
}
