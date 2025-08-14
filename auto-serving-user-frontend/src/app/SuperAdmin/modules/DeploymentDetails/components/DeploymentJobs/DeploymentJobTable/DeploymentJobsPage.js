import { Route, useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { DeploymentJobsUIProvider } from "./DeploymentJobsUIContext";
import { DeploymentJobsCard } from "./DeploymentJobsCard";
import { DeploymentJobNewDialog } from "./deployment-job-new-dialog/DeploymentJobNewDialog";
import { DeploymentJobsViewDialog } from "./deployment-job-view-dialog/DeploymentJobsViewDialog";
import { DeploymentJobStartDialog } from "./deployment-job-start-dialog/DeploymentJobStartDialog";

export function DeploymentJobsPage({ setKey }) {
  const deploymentJobsPageBaseUrl = "/deploymentDetails/deploymentJobsPage";
  const history = useHistory();

  useEffect(
    () => setKey("deploymentJobs"),
    //eslint-disable-next-line
    []
  );

  const deploymentJobsUIEvents = {
    newDeploymentJobBtnClick: () => {
      history.push(`${deploymentJobsPageBaseUrl}/new`);
    },
    openViewDeploymentJobBtnClick: id => {
      history.push(`${deploymentJobsPageBaseUrl}/${id}/view`);
    },
    startDeploymentJobBtnClick: id => {
      history.push(`${deploymentJobsPageBaseUrl}/${id}/deploy`);
    }
  };

  return (
    <DeploymentJobsUIProvider deploymentJobsUIEvents={deploymentJobsUIEvents}>
      <Route path={`${deploymentJobsPageBaseUrl}/new`}>
        {({ history, match }) => (
          <DeploymentJobNewDialog
            show={match != null}
            onHide={() => {
              history.push(deploymentJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${deploymentJobsPageBaseUrl}/:id/view`}>
        {({ history, match }) => (
          <DeploymentJobsViewDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(deploymentJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${deploymentJobsPageBaseUrl}/:id/deploy`}>
        {({ history, match }) => (
          <DeploymentJobStartDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(deploymentJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <DeploymentJobsCard />
    </DeploymentJobsUIProvider>
  );
}
