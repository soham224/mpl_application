import React, {Suspense} from 'react';
import {LayoutSplashScreen} from "../../../_metronic/layout";
import {LogoResults} from "../modules/LogoResult/Index";

export default function LogoResultTabPage() {
    return (
        <Suspense fallback={<LayoutSplashScreen />}>
            <LogoResults />
        </Suspense>
    );
}