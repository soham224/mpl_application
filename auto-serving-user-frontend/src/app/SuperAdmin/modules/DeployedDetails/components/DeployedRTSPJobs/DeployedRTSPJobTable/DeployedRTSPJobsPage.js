import { Route, useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { DeployedRTSPJobsUIProvider } from "./DeployedRTSPJobsUIContext";
import { DeployedRTSPJobsCard } from "./DeployedRTSPJobsCard";
import { DeployedRTSPJobsViewDialog } from "./deployed-rtsp-job-view-dialog/DeployedRTSPJobsViewDialog";
import { DeploymentRTSPJobTerminateDialog } from "./deployed-rtsp-job-terminate-dialog/DeployedRTSPJobTerminateDialog";
import { DeployedRTSPJobsLabelSettingsDialog } from "./deployed-rstp-job-label-settings-dialog/DeployedRTSPJobsLabelSettingsDialog";
import { DeployedRTSPJobsCameraSettingsDialog } from "./deployed-rstp-job-camera-settings-dialog/DeployedRTSPJobsCameraSettingsDialog";

export function DeployedRTSPJobsPage({ setKey }) {
  const deployedRTSPJobsPageBaseUrl = "/deployedDetails/deployedRTSPJobsPage";
  const history = useHistory();

  useEffect(
    () => setKey("deployedRTSPJobs"),
    //eslint-disable-next-line
    []
  );

  const deployedRTSPJobsUIEvents = {
    openViewDeployedRTSPJobBtnClick: id => {
      history.push(`${deployedRTSPJobsPageBaseUrl}/${id}/view`);
    },
    openViewLabelSettingsBtnClick: id => {
      history.push(`${deployedRTSPJobsPageBaseUrl}/${id}/labelSettings`);
    },
    openViewCameraSettingsBtnClick: id => {
      history.push(`${deployedRTSPJobsPageBaseUrl}/${id}/cameraSettings`);
    },
    stopDeploymentRTSPJobBtnClick: id => {
      history.push(`${deployedRTSPJobsPageBaseUrl}/${id}/terminate`);
    }
  };

  return (
    <DeployedRTSPJobsUIProvider
      deployedRTSPJobsUIEvents={deployedRTSPJobsUIEvents}
    >
      <Route path={`${deployedRTSPJobsPageBaseUrl}/:id/view`}>
        {({ history, match }) => (
          <DeployedRTSPJobsViewDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(deployedRTSPJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${deployedRTSPJobsPageBaseUrl}/:id/terminate`}>
        {({ history, match }) => (
          <DeploymentRTSPJobTerminateDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(deployedRTSPJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${deployedRTSPJobsPageBaseUrl}/:id/labelSettings`}>
        {({ history, match }) => (
          <DeployedRTSPJobsLabelSettingsDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(deployedRTSPJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${deployedRTSPJobsPageBaseUrl}/:id/cameraSettings`}>
        {({ history, match }) => (
          <DeployedRTSPJobsCameraSettingsDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(deployedRTSPJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <DeployedRTSPJobsCard />
    </DeployedRTSPJobsUIProvider>
  );
}
