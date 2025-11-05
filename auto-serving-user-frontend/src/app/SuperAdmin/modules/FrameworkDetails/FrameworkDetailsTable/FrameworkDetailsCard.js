import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { FrameworkDetailsTable } from "./framework-details-table/FrameworkDetailsTable";
import { useFrameworkUIContext } from "./FrameworkDetailsUIContext";

export function FrameworkDetailsCard() {
  const frameworkUIContext = useFrameworkUIContext();
  const frameworkUIProps = useMemo(() => {
    return {
      newFrameworkButtonClick: frameworkUIContext.openNewFrameworkDialog,
    };
  }, [frameworkUIContext]);

  return (
    <Card>
      <CardHeader title="Framework Details Data">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={frameworkUIProps.newFrameworkButtonClick}
          >
            Add Framework Details
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <FrameworkDetailsTable />
      </CardBody>
    </Card>
  );
}
