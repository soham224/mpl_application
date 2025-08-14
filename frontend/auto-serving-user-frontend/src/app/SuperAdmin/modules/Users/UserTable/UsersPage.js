import { Route } from "react-router-dom";
import React from "react";
import { UsersUIProvider } from "./UsersUIContext";
import { UsersCard } from "./UsersCard";
import { UsersEditDialog } from "./users-edit-dialog/UsersEditDialog";
import { UsersDetailsDialog } from "./users-details-dialog/UsersDetailsDialog";
import { UsersStatusDialog } from "./users-status-dialog/UsersStatusDialog";
import {UsersServiceManagementEditDialog} from "./users-service-edit-dialog/usersServiceManagementEditDialog";

export function UsersPage({ history, match }) {
  const userPageBaseUrl = "/users/userPage";

  const usersUIEvents = {
    newUserButtonClick: () => {
      history.push(`${userPageBaseUrl}/new`);
    },
    openEditUserDialog: () => {
      history.push(`${userPageBaseUrl}/edit`);
    },
      openUserServiceDialog: () => {
          history.push(`${userPageBaseUrl}/ServiceEdit`);
      },
    openViewUsersDetailsDialog: (id) => {
      history.push(`${userPageBaseUrl}/${id}/viewUsersDetails`);
    },
    openChangeStatusDialog: (id, status) => {
      history.push(`${userPageBaseUrl}/${id}/${status}/changeStatus`);
    },
  };

  return (
    <UsersUIProvider usersUIEvents={usersUIEvents}>
      <Route path={`${userPageBaseUrl}/new`}>
        {({ history, match }) => (
          <UsersEditDialog
            show={match != null}
            onHide={() => {
              history.push(userPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${userPageBaseUrl}/edit`}>
        {({ history, match }) => (
          <UsersEditDialog
            show={match != null}
            onHide={() => {
              history.push(userPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${userPageBaseUrl}/:id/viewUsersDetails`}>
        {({ history, match }) => (
          <UsersDetailsDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(userPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${userPageBaseUrl}/:id/:status/changeStatus`}>
        {({ history, match }) => (
          <UsersStatusDialog
            show={match != null}
            id={match?.params?.id}
            status={match?.params?.status}
            onHide={() => {
              history.push(userPageBaseUrl);
            }}
          />
        )}
      </Route>

        <Route path={`${userPageBaseUrl}/ServiceEdit`}>
            {({ history, match }) => (
                <UsersServiceManagementEditDialog
                    show={match != null}
                    id={match?.params?.id}
                    status={match?.params?.status}
                    onHide={() => {
                        history.push(userPageBaseUrl);
                    }}
                />
            )}
        </Route>
      <UsersCard />
    </UsersUIProvider>
  );
}
