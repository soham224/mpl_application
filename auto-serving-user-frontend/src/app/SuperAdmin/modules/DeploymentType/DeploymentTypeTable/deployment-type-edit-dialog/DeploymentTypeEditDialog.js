import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { DeploymentTypeEditDialogHeader } from "./DeploymentTypeEditDialogHeader";
import { DeploymentTypeEditForm } from "./DeploymentTypeEditForm";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as action from "../../_redux/DeploymentTypeAction";
import { DeploymentTypeSlice } from "../../_redux/DeploymentTypeSlice";
import { SavingDetailsModal } from "../../../../../../utils/SavingDetailsModal";
import { successToast } from "../../../../../../utils/ToastMessage";

const { actions } = DeploymentTypeSlice;

export function DeploymentTypeEditDialog({ id, show, onHide }) {
  const { actionsLoading, deploymentTypeFetchedById } = useSelector(
    state => ({
      actionsLoading: state.deploymentType.actionsLoading,
      deploymentTypeFetchedById: state.deploymentType.deploymentTypeFetchedById
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (id) dispatch(action.fetchDeploymentTypeById(id));
    else dispatch(actions.clearDeploymentTypeById());
  }, [id, dispatch]);

  const [loading, setLoading] = useState(false);
  const saveDeploymentType = deploymentType => {
    setLoading(true);
    if (!id) {
      // server request for creating deploymentType
      dispatch(action.createDeploymentType(deploymentType)).then(() =>
        onHide()
      );
    } else {
      // server request for updating deploymentType
      dispatch(action.deploymentTypeUpdate(deploymentType)).then(() => {
        successToast("DeploymentType Updated Successfully");
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
      <DeploymentTypeEditDialogHeader id={id} />
      <DeploymentTypeEditForm
        onHide={onHide}
        actionsLoading={actionsLoading}
        saveDeploymentType={saveDeploymentType}
        deploymentTypeData={deploymentTypeFetchedById}
      />
    </Modal>
  );
}
