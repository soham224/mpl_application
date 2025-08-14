import React, {Suspense} from "react";

import {ContentRoute, LayoutSplashScreen} from "../../../../../../_metronic/layout";
import {Switch} from "react-router-dom";
import {MyResultPage} from "./MyResultTable/MyResultPage";


export default function DeployedRTSPJobs() {
    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                <ContentRoute path={"/my-results"} component={MyResultPage}/>
            </Switch>
        </Suspense>
    );
}