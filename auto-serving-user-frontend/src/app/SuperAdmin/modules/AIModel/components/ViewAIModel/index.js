import React, { Suspense } from "react";
import { ViewAIModelPage } from "./AIModelTable/ViewAIModelPage";

import { LayoutSplashScreen, ContentRoute } from "../../../../../../_metronic/layout";
import { Redirect, Switch } from "react-router-dom";

export default function ViewAIModel() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
          
             {/*<UsersPage />*/}
            <Switch>
                {
                    /* Redirect from eCommerce root URL to /customers */
                    <Redirect
                        exact={true}
                        from="/aiModel/view"
                        to="/aiModel/view/modelData"
                    />
                }
                <ContentRoute path="/aiModel/view/modelData" component={ViewAIModelPage} />
            </Switch>
        </Suspense>
    );
}
