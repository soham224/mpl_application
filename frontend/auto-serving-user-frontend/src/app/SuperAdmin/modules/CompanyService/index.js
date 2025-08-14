import React, {Suspense} from "react";
import {ContentRoute, LayoutSplashScreen} from "../../../../_metronic/layout";
import {Switch} from "react-router-dom";
import {CompanyServicePage } from "./components/CompanyServicePage";

export default function CompanyService() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path={"/users/userPage"} component={CompanyServicePage} />
      </Switch>
    </Suspense>
  );
}
