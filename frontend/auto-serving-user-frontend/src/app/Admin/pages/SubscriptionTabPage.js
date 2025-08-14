import React, { Suspense, useEffect } from "react";
import { LayoutSplashScreen } from "../../../_metronic/layout";
import { RequestedResults } from "../modules/Subscriptions";
import { ADMIN_URL } from "../../../enums/constant";
import { useHistory } from "react-router-dom";

export default function SubscriptionTabPage() {
  const history = useHistory();
  useEffect(() => {
    history.push(ADMIN_URL + "/subscriptions/deployedJobsPage");
    // eslint-disable-next-line
  }, []);
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <RequestedResults />
    </Suspense>
  );
}
