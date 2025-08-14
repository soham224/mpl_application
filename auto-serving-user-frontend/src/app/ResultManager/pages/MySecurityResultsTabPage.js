import React from "react";
import {useSubheader} from "../../../_metronic/layout";
import MySecurityResults from "../../SecurityManager";

export const MySecurityResultsTabPage = () => {
    const suhbeader = useSubheader();
    suhbeader.setTitle("Violation");

    return <MySecurityResults/>;
};
