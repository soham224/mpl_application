import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as action from "../../_redux/ModelTypeAction";
import { AutoServingStatusChangeAlert } from "../../../../../../utils/AutoServingStatusChangeAlert";

export function ModelTypeStatusDialog({ id, status, show, onHide }) {
  const { entities } = useSelector(
    (state) => ({
      entities: state.modelType.entities,
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
      updateMethod={action.modelTypeUpdate}
    />
  );
}
