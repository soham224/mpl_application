import React, {Suspense, useEffect} from "react";
import { BannerImagePage } from "./ModelBannerImage/BannerImagePage";

import {Redirect, Switch, useHistory} from "react-router-dom";

export default function ModelBannerImage() {


    const history = useHistory();
    useEffect( () => {
        history.push("/aiModel/add/bannerImage")
    },[]);

    return (
        <BannerImagePage/>
    );
}
