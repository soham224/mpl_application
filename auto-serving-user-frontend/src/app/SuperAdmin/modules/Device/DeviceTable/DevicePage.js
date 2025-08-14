import { Route } from "react-router-dom";
import React from "react";
import { DeviceUIProvider } from "./DeviceUIContext";
import { DeviceCard } from "./DeviceCard";
import { DeviceEditDialog } from "./device-edit-dialog/DeviceEditDialog";
import { DeviceStatusDialog } from "./device-status-dialog/DeviceStatusDialog";

export function DevicePage({ history }) {
  const devicePageBaseUrl = "/device/devicePage";

  const deviceUIEvents = {
    newDeviceButtonClick: () => {
      history.push(`${devicePageBaseUrl}/new`);
    },
    editDeviceButtonClick: id => {
      history.push(`${devicePageBaseUrl}/${id}/edit`);
    },
    changeDeviceStatusButtonClick: (id, status) => {
      history.push(`${devicePageBaseUrl}/${id}/${status}/changeStatus`);
    }
  };

  return (
    <DeviceUIProvider deviceUIEvents={deviceUIEvents}>
      <Route path={`${devicePageBaseUrl}/new`}>
        {({ history, match }) => (
          <DeviceEditDialog
            show={match != null}
            onHide={() => {
              history.push(devicePageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${devicePageBaseUrl}/:id/edit`}>
        {({ history, match }) => (
          <DeviceEditDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(devicePageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${devicePageBaseUrl}/:id/:status/changeStatus`}>
        {({ history, match }) => (
          <DeviceStatusDialog
            show={match != null}
            id={match?.params?.id}
            status={match?.params?.status}
            onHide={() => {
              history.push(devicePageBaseUrl);
            }}
          />
        )}
      </Route>
      <DeviceCard />
    </DeviceUIProvider>
  );
}
