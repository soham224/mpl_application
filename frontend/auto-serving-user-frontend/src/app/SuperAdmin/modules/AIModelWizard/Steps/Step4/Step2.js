import React, {Suspense, useEffect} from "react";
import { ResultImagePage } from "./ResultImage/ResultImagePage";

import { LayoutSplashScreen, ContentRoute } from "../../../../../../_metronic/layout";
import {Redirect, Switch, useHistory} from "react-router-dom";
import {ResultImageCard} from "./ResultImage/ResultImageCard";


export default function ModelResultImage() {

    const history = useHistory();
    useEffect( () => {
        history.push("/aiModel/add/resultImage")
    },[]);

    return (
        <ResultImagePage/>
    );
}
