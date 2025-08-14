import React, {Suspense} from "react";
import {LayoutSplashScreen} from "../../../_metronic/layout";
import {MyResults} from "../modules/MyResults";

export default function MyResultsTabPage() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <MyResults/>
        </Suspense>
    );
}
