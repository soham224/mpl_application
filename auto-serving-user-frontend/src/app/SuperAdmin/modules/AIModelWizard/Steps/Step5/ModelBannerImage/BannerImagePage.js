import {Route, useHistory} from "react-router-dom";
import React from "react";
import { UsersUIProvider } from "./BannerImageUIContext";
import { BannerImageCard } from "./BannerImageCard"
import { UsersEditDialog } from "./users-edit-dialog/UsersEditDialog"
//import { UsersDeleteDialog } from "./users-delete-dialog/UsersDeleteDialog"

export function BannerImagePage() {

    const history = useHistory();
    const usersUIEvents = {
        newUserButtonClick: () => {
            history.push("/aiModel/add/bannerImage/new");
        },
        // openDeleteUserDialog: () => {
        //     history.push("/aiModel/add/bannerImage/delete");
        // },
        openEditUserDialog: () => {
            history.push("/aiModel/add/bannerImage/edit");
        }
    };

    return (
        <UsersUIProvider usersUIEvents={usersUIEvents}>
            {/*<CustomersLoadingDialog />*/}
            <Route path="/aiModel/add/bannerImage/new">
                {({ history, match }) => (
                    <UsersEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/bannerImage");
                        }}
                    />
                )}
            </Route>
            <Route path="/aiModel/add/bannerImage/edit">
                {({ history, match }) => (
                    <UsersEditDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/bannerImage");
                        }}
                    />
                )}
            </Route>
            {/* <Route path="/aiModel/add/bannerImage/delete">
                {({ history, match }) => (
                    <UsersDeleteDialog
                        show={match != null}
                        onHide={() => {
                            history.push("/aiModel/add/bannerImage");
                        }}
                    />
                )}
            </Route> */}
            <BannerImageCard />
        </UsersUIProvider>
    );
}
