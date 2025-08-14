import React, { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Switch } from "react-router-dom";
import { LocationPage } from "./components/LocationPage";
import { ADMIN_URL } from "../../../../enums/constant";

export default function Locations() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute
          path={ADMIN_URL + "/locations"}
          component={LocationPage}
        />
      </Switch>
    </Suspense>
  );
}
