import React, { Suspense } from "react";
import { DeploymentTypePage } from "./DeploymentTypeTable/DeploymentTypePage";

import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Redirect, Switch } from "react-router-dom";

export default function DeploymentType() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from deploymentType root URL to /deploymentType/deploymentTypePage */
          <Redirect
            exact={true}
            from="/deploymentType"
            to="/deploymentType/deploymentTypePage"
          />
        }
        <ContentRoute
          path="/deploymentType/deploymentTypePage"
          component={DeploymentTypePage}
        />
      </Switch>
    </Suspense>
  );
}
