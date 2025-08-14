import React from "react";
import {
  Card,
  CardBody
} from "../../../../../../../_metronic/_partials/controls";
import { DeployedRTSPJobTable } from "./deployed-rtsp-job-table/DeployedRTSPJobTable";

export function DeployedRTSPJobsCard() {
  return (
    <Card>
      <CardBody>
        <DeployedRTSPJobTable />
      </CardBody>
    </Card>
  );
}
