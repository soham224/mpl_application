import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../../../_metronic/_partials/controls";
import { DeploymentRTSPJobTable } from "./deployment-rtsp-job-table/DeploymentRTSPJobTable";
import { useDeploymentRTSPJobsUIContext } from "./DeploymentRTSPJobsUIContext";

export function DeploymentRTSPJobsCard() {
  const deploymentRTSPJobUIContext = useDeploymentRTSPJobsUIContext();
  const deploymentRTSPJobUIProps = useMemo(() => {
    return {
      openNewDeploymentRTSPJobDialog:
        deploymentRTSPJobUIContext.openNewDeploymentRTSPJobDialog
    };
  }, [deploymentRTSPJobUIContext]);

  return (
    <Card>
      <CardHeader title="Deployment RTSP jobs Data">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={deploymentRTSPJobUIProps.openNewDeploymentRTSPJobDialog}
          >
            Add Deployment RTSP job
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <DeploymentRTSPJobTable />
      </CardBody>
    </Card>
  );
}
