import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../_metronic/_partials/controls";
import { DeploymentTypeTable } from "./deployment-type-table/DeploymentTypeTable";
import { useDeploymentTypeUIContext } from "./DeploymentTypeUIContext";

export function DeploymentTypeCard() {
  const deploymentTypeUIContext = useDeploymentTypeUIContext();
  const usersUIProps = useMemo(() => {
    return {
      openNewDeploymentTypeDialog:
        deploymentTypeUIContext.openNewDeploymentTypeDialog
    };
  }, [deploymentTypeUIContext]);

  return (
    <Card>
      <CardHeader title="Deployment Type Data">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={usersUIProps.openNewDeploymentTypeDialog}
          >
            Add Deployment Type
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <DeploymentTypeTable />
      </CardBody>
    </Card>
  );
}
