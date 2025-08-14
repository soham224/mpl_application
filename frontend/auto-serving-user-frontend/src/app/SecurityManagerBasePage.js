import React, {lazy, Suspense} from "react";
import {ContentRoute, LayoutSplashScreen} from "../_metronic/layout";
import {shallowEqual, useSelector} from "react-redux";
import Cookies from "universal-cookie";
import {Security} from "./Admin/pages/SecurityPage";

export default function SecurityManagerBasePage() {

    const {user} = useSelector(
        ({auth}) => ({
            isAuthorized: auth.user?.id && new Cookies().get("access_token"),
            user: auth.user
        }),
        shallowEqual
    );


    return (
        <>
                <Suspense fallback={<LayoutSplashScreen/>}>
                    <ContentRoute
                        path={"/dashboard"}
                        component={Security}
                    />
                </Suspense>
        </>
    );
}
