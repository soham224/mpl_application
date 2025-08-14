import React, { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { DevicePage } from "./DeviceTable/DevicePage";
import { Redirect, Switch } from "react-router-dom";

export default function Device() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from device root URL to /device/devicePage */
          <Redirect exact={true} from="/device" to="/device/devicePage" />
        }
        <ContentRoute path="/device/devicePage" component={DevicePage} />
      </Switch>
    </Suspense>
  );
}
