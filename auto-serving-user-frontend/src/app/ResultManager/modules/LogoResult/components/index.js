import React, { Suspense } from "react";
import {
  ContentRoute,
  LayoutSplashScreen,
} from "../../../../../_metronic/layout";
import { Switch } from "react-router-dom";
import {LogoResultsPageCard} from "./LogoResultsPageCard";

export default function LogoResultsPage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path={"/logo-results"} component={LogoResultsPageCard} />
      </Switch>
    </Suspense>
  );
}
