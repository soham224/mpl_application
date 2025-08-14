import { Route } from "react-router-dom";
import React from "react";
import { DeploymentTypeUIProvider } from "./DeploymentTypeUIContext";
import { DeploymentTypeCard } from "./DeploymentTypeCard";
import { DeploymentTypeEditDialog } from "./deployment-type-edit-dialog/DeploymentTypeEditDialog";
import { DeploymentTypeStatusDialog } from "./deployment-type-status-dialog/DeploymentTypeStatusDialog";

export function DeploymentTypePage({ history }) {
  const deploymentTypePageBaseUrl = "/deploymentType/deploymentTypePage";

  const deploymentTypeUIEvents = {
    newDeploymentTypeBtnClick: () => {
      history.push(`${deploymentTypePageBaseUrl}/new`);
    },
    editDeploymentTypeBtnClick: id => {
      history.push(`${deploymentTypePageBaseUrl}/${id}/edit`);
    },
    changeStatusDeploymentTypeBtnClick: (id, status) => {
      history.push(`${deploymentTypePageBaseUrl}/${id}/${status}/changeStatus`);
    }
  };

  return (
    <DeploymentTypeUIProvider deploymentTypeUIEvents={deploymentTypeUIEvents}>
      <Route path={`${deploymentTypePageBaseUrl}/new`}>
        {({ history, match }) => (
          <DeploymentTypeEditDialog
            show={match != null}
            onHide={() => {
              history.push(deploymentTypePageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${deploymentTypePageBaseUrl}/:id/edit`}>
        {({ history, match }) => (
          <DeploymentTypeEditDialog
            show={match != null}
            id={match?.params.id}
            onHide={() => {
              history.push(deploymentTypePageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${deploymentTypePageBaseUrl}/:id/:status/changeStatus`}>
        {({ history, match }) => (
          <DeploymentTypeStatusDialog
            show={match != null}
            id={match?.params.id}
            status={match?.params.status}
            onHide={() => {
              history.push(deploymentTypePageBaseUrl);
            }}
          />
        )}
      </Route>
      <DeploymentTypeCard />
    </DeploymentTypeUIProvider>
  );
}
