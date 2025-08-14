import React, { Suspense } from "react";
import { MyResultPage } from "./MyResultTable/MyResultPage";

import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Switch } from "react-router-dom";

export default function MyResult() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/myResult/myResultPage" component={MyResultPage} />
      </Switch>
    </Suspense>
  );
}
