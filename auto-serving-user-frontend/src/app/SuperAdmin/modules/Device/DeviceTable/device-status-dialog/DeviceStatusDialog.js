import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as action from "../../_redux/DeviceAction";
import { AutoServingStatusChangeAlert } from "../../../../../../utils/AutoServingStatusChangeAlert";

export function DeviceStatusDialog({ id, status, show, onHide }) {
  const { entities } = useSelector(
    state => ({
      entities: state.device.entities
    }),
    shallowEqual
  );

  return (
    <AutoServingStatusChangeAlert
      id={id}
      status={status}
      show={show}
      onHide={onHide}
      entities={entities}
      updateMethod={action.deviceUpdate}
    />
  );
}
