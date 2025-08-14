import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { ModelTypeTable } from "./model-type-table/ModelTypeTable";
import { useModelTypeUIContext } from "./ModelTypeUIContext";

export function ModelTypeCard() {
  const modelTypeUIContext = useModelTypeUIContext();
  const modelTypeUIProps = useMemo(() => {
    return {
      newModelTypeButtonClick: modelTypeUIContext.newModelTypeButtonClick,
    };
  }, [modelTypeUIContext]);

  return (
    <Card>
      <CardHeader title="Model Type Data">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={modelTypeUIProps.newModelTypeButtonClick}
          >
            Add Model Type
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ModelTypeTable />
      </CardBody>
    </Card>
  );
}
