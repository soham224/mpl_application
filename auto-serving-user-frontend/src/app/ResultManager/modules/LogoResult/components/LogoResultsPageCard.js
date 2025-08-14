import React from "react";
import LogoResultsMain from "./LogoResultsMain";
import {HorizontalManagementUIProvider} from "./HorizontalUIContext";

export function LogoResultsPageCard() {

    return (
        <HorizontalManagementUIProvider>
            <LogoResultsMain/>
        </HorizontalManagementUIProvider>
    );
}
