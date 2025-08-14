import {Route, useHistory} from "react-router-dom";
import React from "react";
import {UsersUIProvider} from "./ResultImageUIContext";
import {ResultImageCard} from "./ResultImageCard"
import {UsersEditDialog} from "./users-edit-dialog/UsersEditDialog"

//import { UsersDeleteDialog } from "./users-delete-dialog/UsersDeleteDialog"

export function ResultImagePage() {
    const history = useHistory();

    const usersUIEvents = {
        newUserButtonClick: () => {
            history.push("/aiModel/add/resultImage/new");
        },
        // openDeleteUserDialog: () => {
        //     history.push("/aiModel/add/resultImage/delete");
        // },
        openEditUserDialog: () => {
            history.push("/aiModel/add/resultImage/edit");
        }
    };

    return (
        <UsersUIProvider usersUIEvents={usersUIEvents}>
            {/*<CustomersLoadingDialog />*/}
            <Route path="/aiModel/add/resultImage/new">
                {({ history, match }) => (
                    <UsersEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/resultImage");
                        }}
                    />
                )}
            </Route>
            <Route path="/aiModel/add/resultImage/edit">
                {({ history, match }) => (
                    <UsersEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/resultImage");
                        }}
                    />
                )}
            </Route>
            {/* <Route path="/aiModel/add/resultImage/delete">
                {({ history, match }) => (
                    <UsersDeleteDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/resultImage");
                        }}
                    />
                )}
            </Route> */}
            <ResultImageCard />
        </UsersUIProvider>
    );
}
