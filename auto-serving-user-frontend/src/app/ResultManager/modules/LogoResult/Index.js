import React from "react";
import {useSubheader} from "../../../../_metronic/layout";
 import LogoResultsPage from "./components";

export function LogoResults() {
    const subheader = useSubheader();
    subheader.setTitle("Logo Results");

    return <LogoResultsPage/>;
}