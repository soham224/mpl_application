import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { DeviceEditDialogHeader } from "./DeviceEditDialogHeader";
import { DeviceEditForm } from "./DeviceEditForm";
import * as action from "../../_redux/DeviceAction";
import { DeviceSlice } from "../../_redux/DeviceSlice";
import { SavingDetailsModal } from "../../../../../../utils/SavingDetailsModal";
import { successToast } from "../../../../../../utils/ToastMessage";

const { actions } = DeviceSlice;

export function DeviceEditDialog({ id, show, onHide }) {
  const { actionsLoading, deviceFetchedById } = useSelector(
    state => ({
      actionsLoading: state.device.actionsLoading,
      deviceFetchedById: state.device.deviceFetchedById
    }),
    shallowEqual
  );
  //
  const dispatch = useDispatch();

  useEffect(() => {
    if (id != null || id !== undefined) {
      dispatch(action.fetchDeviceById(id));
    } else {
      dispatch(actions.clearDeviceById());
    }
  }, [id, dispatch]);

  const [loading, setLoading] = useState(false);
  const saveDevice = device => {
    setLoading(true);
    if (!id) {
      // server request for creating device
      dispatch(action.createDevice(device)).then(() => onHide());
    } else {
      // server request for updating device
      dispatch(action.deviceUpdate(device)).then(() => {
        successToast("Device updated successfully");
        onHide();
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <SavingDetailsModal show={loading} top={"start"} />
      <DeviceEditDialogHeader id={id} />
      <DeviceEditForm
        saveDevice={saveDevice}
        actionsLoading={actionsLoading}
        deviceData={deviceFetchedById}
        onHide={onHide}
      />
    </Modal>
  );
}
