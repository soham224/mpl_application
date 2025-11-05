import React, {Suspense, useEffect} from "react";
import { S3DataHandlerPage } from "./S3DataHandler/S3DataHandlerPage";
import {Redirect, Switch, useHistory} from "react-router-dom";

export default function S3DataHandler() {
    const history = useHistory();
    useEffect( () => {
        history.push("/aiModel/add/s3DataHandler")
    },[]);

    return (
        <S3DataHandlerPage/>
    );
}
