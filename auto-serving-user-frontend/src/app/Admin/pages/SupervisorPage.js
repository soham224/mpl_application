import {
  ContentRoute,
  LayoutSplashScreen,
  useSubheader,
} from "../../../_metronic/layout";
import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { ADMIN_URL } from "../../../enums/constant";
import { SupervisorPage } from "../modules/AddSupervisor";

export function Supervisor() {
  const subheader = useSubheader();
  subheader.setTitle("Supervisor");

  return (
    //<Supervisors/>
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute
          path={ADMIN_URL + "/addSupervisor"}
          component={SupervisorPage}
        />
      </Switch>
    </Suspense>
  );
}
