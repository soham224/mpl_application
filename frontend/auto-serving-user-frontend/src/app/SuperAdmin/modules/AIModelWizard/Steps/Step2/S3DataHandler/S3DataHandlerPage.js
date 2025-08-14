import {Route, useHistory} from "react-router-dom";
import React from "react";
import { UsersUIProvider } from "./S3DataHandlerUIContext";
import { S3DataHandlerCard } from "./S3DataHandlerCard"
import { UsersEditDialog } from "./users-edit-dialog/UsersEditDialog"
//import { UsersDeleteDialog } from "./users-delete-dialog/UsersDeleteDialog"

export function S3DataHandlerPage() {
    const history = useHistory();

    const usersUIEvents = {
        newUserButtonClick: () => {
            history.push("/aiModel/add/s3DataHandler/new");
        },
        // openDeleteUserDialog: () => {
        //     history.push("/aiModel/add/s3DataHandler/delete");
        // },
        openEditUserDialog: () => {
            history.push("/aiModel/add/s3DataHandler/edit");
        }
    };

    return (
        <UsersUIProvider usersUIEvents={usersUIEvents}>
            {/*<CustomersLoadingDialog />*/}
            <Route path="/aiModel/add/s3DataHandler/new">
                {({ history, match }) => (
                    <UsersEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/s3DataHandler");
                        }}
                    />
                )}
            </Route>
            <Route path="/aiModel/add/s3DataHandler/edit">
                {({ history, match }) => (
                    <UsersEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/s3DataHandler");
                        }}
                    />
                )}
            </Route>
            {/* <Route path="/aiModel/add/s3DataHandler/delete">
                {({ history, match }) => (
                    <UsersDeleteDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/s3DataHandler");
                        }}
                    />
                )}
            </Route> */}
            <S3DataHandlerCard />
        </UsersUIProvider>
    );
}
