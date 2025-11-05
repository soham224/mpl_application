import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { InferJobTable } from "./infer-job-table/InferJobTable";
import { useInferJobsUIContext } from "./InferJobsUIContext";

export function InferJobsCard() {
  const inferJobUIContext = useInferJobsUIContext();
  const inferJobUIProps = useMemo(() => {
    return {
      openNewInferJobDialog: inferJobUIContext.openNewInferJobDialog,
    };
  }, [inferJobUIContext]);

  return (
    <Card>
      <CardHeader title="Infer Jobs Data">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={inferJobUIProps.openNewInferJobDialog}
          >
            Add Infer Job
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <InferJobTable />
      </CardBody>
    </Card>
  );
}
