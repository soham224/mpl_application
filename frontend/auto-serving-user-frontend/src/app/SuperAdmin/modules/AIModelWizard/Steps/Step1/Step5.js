import React, {Suspense, useEffect} from "react";
import { AiModelDetailsPage } from "./AIModel/AiModelDetailsPage";
import {useHistory} from "react-router-dom";


export default function AiModelDetails() {

    const history = useHistory();
    useEffect( () => {
        history.push("/aiModel/add/aiModelDetails")
    },[]);

    return (
        <AiModelDetailsPage/>
    );

}
