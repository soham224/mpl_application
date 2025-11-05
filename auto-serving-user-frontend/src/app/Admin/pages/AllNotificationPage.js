import {useSubheader} from "../../../_metronic/layout";
import NotificationPage from "../modules/Notification";
import React from "react";

export function AllNotificationPage(){
    const subheader = useSubheader();
    subheader.setTitle("All ViolationNotification");

    return (
        <NotificationPage/>
    );
}
