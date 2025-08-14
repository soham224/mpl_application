import { Route, useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { DeployedJobsUIProvider } from "./DeployedJobsUIContext";
import { DeployedJobsCard } from "./DeployedJobsCard";
import { DeployedJobsViewDialog } from "./deployed-job-view-dialog/DeployedJobsViewDialog";
import { DeploymentJobTerminateDialog } from "./deployed-job-terminate-dialog/DeployedJobTerminateDialog";

export function DeployedJobsPage({ setKey }) {
  const deployedJobsPageBaseUrl = "/deployedDetails/deployedJobsPage";
  const history = useHistory();

  useEffect(
    () => setKey("deployedJobs"),
    //eslint-disable-next-line
    []
  );

  const deployedJobsUIEvents = {
    openViewDeployedJobBtnClick: id => {
      history.push(`${deployedJobsPageBaseUrl}/${id}/view`);
    },
    stopDeploymentJobBtnClick: id => {
      history.push(`${deployedJobsPageBaseUrl}/${id}/terminate`);
    }
  };

  return (
    <DeployedJobsUIProvider deployedJobsUIEvents={deployedJobsUIEvents}>
      <Route path={`${deployedJobsPageBaseUrl}/:id/view`}>
        {({ history, match }) => (
          <DeployedJobsViewDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(deployedJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${deployedJobsPageBaseUrl}/:id/terminate`}>
        {({ history, match }) => (
          <DeploymentJobTerminateDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(deployedJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <DeployedJobsCard />
    </DeployedJobsUIProvider>
  );
}
