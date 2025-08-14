import React, { Suspense } from "react";
import { ModelTypePage } from "./ModeTypeTable/ModelTypePage";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Redirect, Switch } from "react-router-dom";

export default function ModelType() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from modelType root URL to /modelType/modelTypePage */
          <Redirect
            exact={true}
            from="/modelType"
            to="/modelType/modelTypePage"
          />
        }
        <ContentRoute
          path="/modelType/modelTypePage"
          component={ModelTypePage}
        />
      </Switch>
    </Suspense>
  );
}
