import React from "react";
import {
  Card,
  CardBody
} from "../../../../../../../_metronic/_partials/controls";
import { DeployedJobTable } from "./deployed-job-table/DeployedJobTable";

export function DeployedJobsCard() {
  return (
    <Card>
      <CardBody>
        <DeployedJobTable />
      </CardBody>
    </Card>
  );
}
