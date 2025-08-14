import React, {Suspense} from "react";
import {ContentRoute, LayoutSplashScreen,} from "../../../../../../_metronic/layout";
import {Switch} from "react-router-dom";
import {MyEventPage} from "./MyEventTable/MyEventPage";

export default function DeployedRTSPJobs() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <Switch>
                <ContentRoute path={"/events"} component={MyEventPage} />
            </Switch>
        </Suspense>
    );
}
