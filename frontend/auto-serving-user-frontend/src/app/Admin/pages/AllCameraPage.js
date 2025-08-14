import React, { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../../../_metronic/layout";
import { Switch } from "react-router-dom";
import { ADMIN_URL } from "../../../enums/constant";
import AllCameraTabPage from "../modules/AllCameraTable";
AllCameraPage.propTypes = {};
function AllCameraPage(props) {
  return (
    <div>
      <Suspense fallback={<LayoutSplashScreen />}>
        <Switch>
          <ContentRoute
            path={ADMIN_URL + "/allCamera"}
            component={AllCameraTabPage}
          />
        </Switch>
      </Suspense>
    </div>
  );
}

export default AllCameraPage;
