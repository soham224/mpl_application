import { Route } from "react-router-dom";
import React from "react";
import { FrameworkUIProvider } from "./FrameworkDetailsUIContext";
import { FrameworkDetailsCard } from "./FrameworkDetailsCard";
import { FrameworkDetailsEditDialog } from "./framework-details-edit-dialog/FrameworkDetailsEditDialog";
import { FrameworkDetailsStatusDialog } from "./framework-status-dialog/FrameworkDetailsStatusDialog";

export function FrameworkDetailsPage({ history }) {
  const frameworkPageBaseUrl = "/frameworkDetails/frameworkDetailsPage";

  const frameworkDetailsUIEvents = {
    newFrameworkBtnClick: () => {
      history.push(`${frameworkPageBaseUrl}/new`);
    },
    changeStatusFrameworkBtnClick: (id, status, isDeprecatedStatus) => {
      history.push(
        `${frameworkPageBaseUrl}/${id}/${status}/${isDeprecatedStatus}/changeStatus`
      );
    },
    editFrameworkBtnClick: (id) => {
      history.push(`${frameworkPageBaseUrl}/${id}/edit`);
    },
  };

  return (
    <FrameworkUIProvider frameworkDetailsUIEvents={frameworkDetailsUIEvents}>
      <Route path={`${frameworkPageBaseUrl}/new`}>
        {({ history, match }) => (
          <FrameworkDetailsEditDialog
            show={match != null}
            onHide={() => {
              history.push(frameworkPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${frameworkPageBaseUrl}/:id/edit`}>
        {({ history, match }) => (
          <FrameworkDetailsEditDialog
            show={match != null}
            id={match?.params.id}
            onHide={() => {
              history.push(frameworkPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route
        path={`${frameworkPageBaseUrl}/:id/:status/:isDeprecatedStatus/changeStatus`}
      >
        {({ history, match }) => (
          <FrameworkDetailsStatusDialog
            show={match != null}
            id={match?.params.id}
            status={match?.params.status}
            isDeprecatedStatus={match?.params.isDeprecatedStatus}
            onHide={() => {
              history.push(frameworkPageBaseUrl);
            }}
          />
        )}
      </Route>
      <FrameworkDetailsCard />
    </FrameworkUIProvider>
  );
}
