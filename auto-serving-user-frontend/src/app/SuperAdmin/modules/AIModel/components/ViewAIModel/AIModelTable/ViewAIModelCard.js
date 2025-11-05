import React from "react";
import {Card, CardBody, CardHeader,} from "../../../../../../../_metronic/_partials/controls";
import {ViewAIModelTable} from "./ai-model-table/ViewAIModelTable";

export function ViewAIModelCard() {

    return (
        <Card>
            <CardHeader title="View AI Model Data"/>
            <CardBody>
                <ViewAIModelTable/>
            </CardBody>
        </Card>
    );
}
