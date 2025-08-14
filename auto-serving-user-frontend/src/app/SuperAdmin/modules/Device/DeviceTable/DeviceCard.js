import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../_metronic/_partials/controls";
import { DeviceTable } from "./device-table/DeviceTable";
import { useDeviceUIContext } from "./DeviceUIContext";

export function DeviceCard() {
  const deviceUIContext = useDeviceUIContext();
  const deviceUIProps = useMemo(() => {
    return {
      openNewDeviceDialog: deviceUIContext.openNewDeviceDialog
    };
  }, [deviceUIContext]);

  return (
    <Card>
      <CardHeader title="Device Data">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={deviceUIProps.openNewDeviceDialog}
          >
            Add Device
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <DeviceTable />
      </CardBody>
    </Card>
  );
}
