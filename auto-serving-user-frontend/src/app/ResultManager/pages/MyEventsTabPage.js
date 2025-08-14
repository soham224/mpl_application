import React, { Suspense } from "react";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import {MyEvents} from "../modules/MyEvents";

export default function MyEventsTabPage() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <MyEvents/>
        </Suspense>
    );
}
