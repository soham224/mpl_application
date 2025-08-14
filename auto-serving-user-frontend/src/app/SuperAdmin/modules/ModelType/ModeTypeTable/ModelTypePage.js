import { Route } from "react-router-dom";
import React from "react";
import { ModelTypeUIProvider } from "./ModelTypeUIContext";
import { ModelTypeCard } from "./ModelTypeCard";
import { ModelTypeEditDialog } from "./model-type-edit-dialog/ModelTypeEditDialog";
import { ModelTypeStatusDialog } from "./model-type-status-dialog/ModelTypeStatusDialog";

export function ModelTypePage({ history }) {
  const modelTypePageBaseUrl = "/modelType/modelTypePage";

  const modelTypeUIEvents = {
    newModelTypeButtonClick: () => {
      history.push(`${modelTypePageBaseUrl}/new`);
    },
    openChangeStatusDialog: (id, status) => {
      history.push(`${modelTypePageBaseUrl}/${id}/${status}/changeStatus`);
    },
    openEditModelTypeDialog: (id) => {
      history.push(`${modelTypePageBaseUrl}/${id}/edit`);
    },
  };

  return (
    <ModelTypeUIProvider modelTypeUIEvents={modelTypeUIEvents}>
      <Route path={`${modelTypePageBaseUrl}/new`}>
        {({ history, match }) => (
          <ModelTypeEditDialog
            show={match != null}
            onHide={() => {
              history.push(modelTypePageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${modelTypePageBaseUrl}/:id/edit`}>
        {({ history, match }) => (
          <ModelTypeEditDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(modelTypePageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${modelTypePageBaseUrl}/:id/:status/changeStatus`}>
        {({ history, match }) => (
          <ModelTypeStatusDialog
            show={match != null}
            id={match?.params?.id}
            status={match?.params?.status}
            onHide={() => {
              history.push(modelTypePageBaseUrl);
            }}
          />
        )}
      </Route>
      <ModelTypeCard />
    </ModelTypeUIProvider>
  );
}
