import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import AIModelWizard from "../AIModelWizard/wizard";
import ViewAIModel from "./components/ViewAIModel";

export default function AIModel() {
    return (
        <Switch>
            <Redirect
                exact={true}
                from="/aiModel"
                to="/aiModel/add"
            />
            {/* Surfaces */}
            <ContentRoute from="/aiModel/add" component={AIModelWizard} />

            {/* Layout */}
            <ContentRoute from="/aiModel/view" component={ViewAIModel} />

        </Switch>
    );
}
