import React, { Suspense } from "react";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import {MyEventView} from "../modules/MyEventView";


export default function MyEventsViewTabPage() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <MyEventView />
        </Suspense>
    );
}
