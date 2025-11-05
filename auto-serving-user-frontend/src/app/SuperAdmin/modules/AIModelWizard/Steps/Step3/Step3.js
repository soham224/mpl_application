import React, {Suspense, useEffect} from "react";
import { TrainingSettingsPage } from "./TrainingSettings/TrainingSettingsPage";
import {useHistory} from "react-router-dom";


export default function TrainingSettings() {

    const history = useHistory();
    useEffect( () => {
        history.push("/aiModel/add/trainingSettings")
    },[]);

    return (
        <TrainingSettingsPage/>
    );

}
