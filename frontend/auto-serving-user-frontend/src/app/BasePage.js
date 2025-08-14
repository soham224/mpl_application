import React, {lazy, Suspense} from "react";
import {Switch} from "react-router-dom";
import {ContentRoute, LayoutSplashScreen} from "../_metronic/layout";
import {DashboardPage} from "./Admin/pages/DashboardPage";
import MyResultsTabPage from "./Admin/pages/MyResultsTabPage";
import {AllNotificationPage} from "./Admin/pages/AllNotificationPage";
import AnprManagerPage from "./Admin/pages/ANPRManagerPage";
import ANPRManagerViolationPage from "./Admin/pages/ANPRManagerViolationPage";
import NotificationManagerPage from "./Admin/pages/NotificationManagerPage";

export default function BasePage() {
    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                <ContentRoute path="/admin/dashboard" component={DashboardPage}/>
                <ContentRoute path="/admin/ANPRManager" component={AnprManagerPage}/>
                <ContentRoute path="/admin/ANPRViolation" component={ANPRManagerViolationPage}/>
                <ContentRoute path="/my-results" component={MyResultsTabPage}/>
                <ContentRoute path="/allNotification" component={AllNotificationPage}/>
                <ContentRoute path="/notification-manager" component={NotificationManagerPage}/>

            </Switch>
        </Suspense>
    );
}
