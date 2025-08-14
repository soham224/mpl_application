import {Route} from "react-router-dom";
import React from "react";
import {AIModelUIProvider} from "./ViewAIModelUIContext";
import {ViewAIModelCard} from "./ViewAIModelCard";
import {AIModelEditDialog} from "./ai-model-edit-dialog/AIModelEditDialog";
import {AIModelDetailsDialog} from "./ai-model-details-dialog/AIModelDetailsDialog";
import {AIModelStatusDialog} from "./ai-model-status-dialog/AIModelStatusDialog";


export function ViewAIModelPage({history}) {

    const AI_MODEL_PAGE_BASE_URL = "/aiModel/view/modelData";

    const aiModelUIEvents = {
        openEditAIModelDialog: (id) => {
            history.push(`${AI_MODEL_PAGE_BASE_URL}/${id}/edit`);
        },
        openChangeStatusDialog: (id, status) => {
            history.push(`${AI_MODEL_PAGE_BASE_URL}/${id}/${status}/changeStatus`);
        },
        openViewAIModelsDetailsDialog: (id) => {
            history.push(`${AI_MODEL_PAGE_BASE_URL}/${id}/viewAIModelDetails`);
        }
    };

    return (
        <AIModelUIProvider aiModelUIEvents={aiModelUIEvents}>
            <Route path={`${AI_MODEL_PAGE_BASE_URL}/:id/edit`}>
                {({history, match}) => (

                    <AIModelEditDialog
                        show={match != null}
                        id={match && match.params.id}
                        onHide={() => {
                            history.push(AI_MODEL_PAGE_BASE_URL);
                        }}
                    />

                )}
            </Route>
            <Route path={`${AI_MODEL_PAGE_BASE_URL}/:id/:status/changeStatus`}>
                {({history, match}) => (
                    <AIModelStatusDialog
                        show={match != null}
                        id={match?.params?.id}
                        status={match?.params?.status}
                        onHide={() => {
                            history.push(AI_MODEL_PAGE_BASE_URL);
                        }}
                    />
                )}
            </Route>
            <Route path={`${AI_MODEL_PAGE_BASE_URL}/:id/viewAIModelDetails`}>
                {({history, match}) => (
                    <AIModelDetailsDialog
                        show={match != null}
                        id={match && match.params.id}
                        onHide={() => {
                            history.push(AI_MODEL_PAGE_BASE_URL);
                        }}
                    />
                )}
            </Route>
            <ViewAIModelCard />
        </AIModelUIProvider>
    );
}
