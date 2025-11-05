import React, { Suspense } from "react";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import {MyNotificationView} from "../modules/MyNotification";

function MyNotificationTabPage() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <MyNotificationView />
        </Suspense>
    );
}

export default MyNotificationTabPage;