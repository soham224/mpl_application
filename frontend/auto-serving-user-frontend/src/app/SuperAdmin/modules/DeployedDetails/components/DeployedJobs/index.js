import React, {Suspense} from "react";
import {DeployedJobsPage} from "./DeployedJobTable/DeployedJobsPage";

import {ContentRoute, LayoutSplashScreen} from "../../../../../../_metronic/layout";
import {Redirect, Switch} from "react-router-dom";

export default function DeployedJobs({setKey}) {
    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    /* Redirect from /deployedJobs root URL to /deployedJobs/deployedJobsPage */
                    <Redirect
                        exact={true}
                        from="/deployedDetails"
                        to="/deployedDetails/deployedJobsPage"
                    />
                }
                <ContentRoute path="/deployedDetails/deployedJobsPage" children={<DeployedJobsPage setKey={setKey}/>}/>
            </Switch>
        </Suspense>
    );
}
