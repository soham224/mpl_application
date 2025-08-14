import {Route, useHistory} from "react-router-dom";
import React, { useEffect } from "react";
import { AIModelUIProvider } from "./AiModelDetailsUIContext";
import { AiModelDetailsCard } from "./AiModelDetailsCard"
import { AIModelEditDialog } from "./ai-model-edit-dialog/AIModelEditDialog";
//import { UsersDeleteDialog } from "./users-delete-dialog/UsersDeleteDialog"

export function AiModelDetailsPage() {

    const history = useHistory();

    const usersUIEvents = {
        newUserButtonClick: () => {
            history.push("/aiModel/add/aiModelDetails/new");
        },
        // openDeleteUserDialog: () => {
        //     history.push("/aiModel/add/aiModelDetails/delete");
        // },
        openEditUserDialog: () => {
            history.push("/aiModel/add/aiModelDetails/edit");
        }
    };

    return (
        <AIModelUIProvider usersUIEvents={usersUIEvents}>
            {/*<CustomersLoadingDialog />*/}
            <Route path="/aiModel/add/aiModelDetails/new">
                {({ history, match }) => (
                    <AIModelEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/aiModelDetails");
                        }}
                    />
                )}
            </Route>
            <Route path="/aiModel/add/aiModelDetails/edit">
                {({ history, match }) => (
                    <AIModelEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/aiModelDetails");
                        }}
                    />
                )}
            </Route>
            {/* <Route path="/aiModel/add/aiModelDetails/delete">
                {({ history, match }) => (
                    <UsersDeleteDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/aiModelDetails");
                        }}
                    />
                )}
            </Route> */}
            <AiModelDetailsCard />
        </AIModelUIProvider>
    );
}
