import React, { Suspense } from "react";
import { UsersPage } from "./UserTable/UsersPage";

import { ContentRoute, LayoutSplashScreen } from "../../../../_metronic/layout";
import { Redirect, Switch } from "react-router-dom";

export default function Users() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from users root URL to /users/userPage */
          <Redirect exact={true} from="/users" to="/users/userPage" />
        }
        <ContentRoute path="/users/userPage" component={UsersPage} />
      </Switch>
    </Suspense>
  );
}
