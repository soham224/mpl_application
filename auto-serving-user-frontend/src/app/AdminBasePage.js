import React, {lazy, Suspense} from "react";
import {ContentRoute, LayoutSplashScreen} from "../_metronic/layout";
import {BuilderPage} from "./Admin/pages/BuilderPage";
import {LocationPage} from "./Admin/pages/LocationPage";
import {DashboardPage} from "./Admin/pages/DashboardPage";
import SubscriptionTabPage from "./Admin/pages/SubscriptionTabPage";
import MyResultsTabPage from "./Admin/pages/MyResultsTabPage";
import {Supervisor} from "./Admin/pages/SupervisorPage";
import {ADMIN_URL} from "../enums/constant";
import {shallowEqual, useSelector} from "react-redux";
import {AllNotificationPage} from "./Admin/pages/AllNotificationPage";
import Cookies from "universal-cookie";
import AllCameraPage from "./Admin/pages/AllCameraPage";
import NotificationManagerPage from "./Admin/pages/NotificationManagerPage";

export default function AdminBasePage() {

    const {user} = useSelector(
        ({auth}) => ({
            isAuthorized: auth.user?.id && new Cookies().get("access_token"),
            user: auth.user
        }),
        shallowEqual
    );


//   useEffect(() => {
//     if (user) {
//       getAllDeployedRTSPJobsDetails()
//         .then(response => {
//           if (response && response.isSuccess) {
//             dispatch(setSubscription(true));
//             setUser(true);
//           }
//         })
//         .catch(error => {
//           setUser(false);
//           dispatch(setSubscription(false));
//           if (error.detail) {
//             warningToast(error.detail);
//           } else {
//             warningToast("Something went Wrong");
//           }
//         });
//     }
//
    // }, []);


    return (
        <>

            {!user ? (
                <>
                    <ContentRoute
                        path={ADMIN_URL + "/locations"}
                        component={LocationPage}
                    />
                    <ContentRoute
                        path={ADMIN_URL + "/addSupervisor"}
                        component={Supervisor}
                    />

                    <ContentRoute
                        path={"/allNotification"}
                        component={AllNotificationPage}
                    />
                    <ContentRoute
                        path={ADMIN_URL + "/subscriptions"}
                        component={SubscriptionTabPage}
                    />
                </>
            ) : null}
            {user && (
                <Suspense fallback={<LayoutSplashScreen/>}>
                    <ContentRoute
                        path={ADMIN_URL + "/dashboard"}
                        component={DashboardPage}
                    />

                    <ContentRoute
                        path={ADMIN_URL + "/subscriptions"}
                        component={SubscriptionTabPage}
                    />
                    <ContentRoute path={"/my-results"} component={MyResultsTabPage}/>
                    <ContentRoute path={ADMIN_URL + "/builder"} component={BuilderPage}/>
                    <ContentRoute
                        path={ADMIN_URL + "/locations"}
                        component={LocationPage}
                    />
                    <ContentRoute
                        path={ADMIN_URL + "/addSupervisor"}
                        component={Supervisor}
                    />
                    <ContentRoute
                        path={ADMIN_URL + "/allCamera"}
                        component={AllCameraPage}
                    />

                    <ContentRoute
                        path={"/allNotification"}
                        component={AllNotificationPage}
                    />
                    <ContentRoute path="/notification-manager" component={NotificationManagerPage}/>

                </Suspense>
            )}
        </>
    );
}
