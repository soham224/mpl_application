import { Route, useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { DeploymentRTSPJobsUIProvider } from "./DeploymentRTSPJobsUIContext";
import { DeploymentRTSPJobsCard } from "./DeploymentRTSPJobsCard";
import { DeploymentRTSPJobNewDialog } from "./deployment-rtsp-job-new-dialog/DeploymentRTSPJobNewDialog";
import { DeploymentRTSPJobsViewDialog } from "./deployment-rtsp-job-view-dialog/DeploymentRTSPJobsViewDialog";
import { DeploymentRTSPJobStartDialog } from "./deployment-rtsp-job-start-dialog/DeploymentRTSPJobStartDialog";

export function DeploymentRTSPJobsPage({ setKey }) {
  const deploymentRTSPJobsPageBaseUrl =
    "/deploymentDetails/deploymentRTSPJobsPage";
  const history = useHistory();

  useEffect(
    () => setKey("deploymentRTSPJobs"),
    //eslint-disable-next-line
    []
  );

  const deploymentRTSPJobsUIEvents = {
    newDeploymentRTSPJobBtnClick: () => {
      history.push(`${deploymentRTSPJobsPageBaseUrl}/new`);
    },
    openViewDeploymentRTSPJobBtnClick: id => {
      history.push(`${deploymentRTSPJobsPageBaseUrl}/${id}/view`);
    },
    openStartDeploymentRTSPJobBtnClick: id => {
      history.push(`${deploymentRTSPJobsPageBaseUrl}/${id}/deploy`);
    }
  };

  return (
    <DeploymentRTSPJobsUIProvider
      deploymentRTSPJobsUIEvents={deploymentRTSPJobsUIEvents}
    >
      <Route path={`${deploymentRTSPJobsPageBaseUrl}/new`}>
        {({ history, match }) => (
          <DeploymentRTSPJobNewDialog
            show={match != null}
            onHide={() => {
              history.push(deploymentRTSPJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${deploymentRTSPJobsPageBaseUrl}/:id/view`}>
        {({ history, match }) => (
          <DeploymentRTSPJobsViewDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(deploymentRTSPJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${deploymentRTSPJobsPageBaseUrl}/:id/deploy`}>
        {({ history, match }) => (
          <DeploymentRTSPJobStartDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(deploymentRTSPJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <DeploymentRTSPJobsCard />
    </DeploymentRTSPJobsUIProvider>
  );
}
