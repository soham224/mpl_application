import React, { Suspense } from "react";
import { ContentRoute, LayoutSplashScreen } from "../_metronic/layout";
import MyResultsTabPage from "./ResultManager/pages/MyResultsTabPage";
import MyEventsTabPage from "./ResultManager/pages/MyEventsTabPage";
import MyEventsViewTabPage from "./ResultManager/pages/MyEventsViewTabPage";
import MyNotificationTabPage from "./ResultManager/pages/MyNotificationTabPage";
import LogoResultTabPage from "./ResultManager/pages/LogoResultTabPage";

export default function ResultManagerBasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <ContentRoute path={"/my-results"} component={MyResultsTabPage} />
      <ContentRoute path={"/events"} component={MyEventsTabPage} />
      <ContentRoute path={"/eventsList"} component={MyEventsViewTabPage} />
      <ContentRoute path={"/notificationAlert"} component={MyNotificationTabPage} />
      <ContentRoute path={"/logo-results"} component={LogoResultTabPage} />
    </Suspense>
  );
}
