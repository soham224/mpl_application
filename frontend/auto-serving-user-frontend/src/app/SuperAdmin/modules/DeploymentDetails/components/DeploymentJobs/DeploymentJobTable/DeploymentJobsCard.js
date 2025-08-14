import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../../../_metronic/_partials/controls";
import { DeploymentJobTable } from "./deployment-job-table/DeploymentJobTable";
import { useDeploymentJobsUIContext } from "./DeploymentJobsUIContext";

export function DeploymentJobsCard() {
  const deploymentJobUIContext = useDeploymentJobsUIContext();
  const deploymentJobUIProps = useMemo(() => {
    return {
      openNewDeploymentJobDialog:
        deploymentJobUIContext.openNewDeploymentJobDialog
    };
  }, [deploymentJobUIContext]);

  return (
    <Card>
      <CardHeader title="Deployment Jobs Data">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={deploymentJobUIProps.openNewDeploymentJobDialog}
          >
            Add Deployment Job
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <DeploymentJobTable />
      </CardBody>
    </Card>
  );
}
