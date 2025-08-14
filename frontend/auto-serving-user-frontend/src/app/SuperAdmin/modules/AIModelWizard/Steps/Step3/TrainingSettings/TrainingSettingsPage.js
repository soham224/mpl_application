import {Route, useHistory} from "react-router-dom";
import React from "react";
import { UsersUIProvider } from "./TrainingSettingsUIContext";
import { TrainingSettingsCard } from "./TrainingSettingsCard"
import { UsersEditDialog } from "./users-edit-dialog/UsersEditDialog"
//import { UsersDeleteDialog } from "./users-delete-dialog/UsersDeleteDialog"

export function TrainingSettingsPage() {
    
    const history = useHistory();
    const usersUIEvents = {
        newUserButtonClick: () => {
            history.push("/aiModel/add/trainingSettings/new");
        },
        // openDeleteUserDialog: () => {
        //     history.push("/aiModel/add/trainingSettings/delete");
        // },
        openEditUserDialog: () => {
            history.push("/aiModel/add/trainingSettings/edit");
        }
    };

    return (
        <UsersUIProvider usersUIEvents={usersUIEvents}>
            {/*<CustomersLoadingDialog />*/}
            <Route path="/aiModel/add/trainingSettings/new">
                {({ history, match }) => (
                    <UsersEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/trainingSettings");
                        }}
                    />
                )}
            </Route>
            <Route path="/aiModel/add/trainingSettings/edit">
                {({ history, match }) => (
                    <UsersEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/trainingSettings");
                        }}
                    />
                )}
            </Route>
            {/* <Route path="/aiModel/add/trainingSettings/delete">
                {({ history, match }) => (
                    <UsersDeleteDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/trainingSettings");
                        }}
                    />
                )}
            </Route> */}
            <TrainingSettingsCard />
        </UsersUIProvider>
    );
}
