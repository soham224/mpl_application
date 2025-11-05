import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModelTypeEditDialogHeader } from "./ModelTypeEditDialogHeader";
import { ModelTypeEditForm } from "./ModelTypeEditForm";
import { ModelTypeSlice } from "../../_redux/ModelTypeSlice";
import * as action from "../../_redux/ModelTypeAction";
import { SavingDetailsModal } from "../../../../../../utils/SavingDetailsModal";
import { successToast } from "../../../../../../utils/ToastMessage";

const { actions } = ModelTypeSlice;

export function ModelTypeEditDialog({ id, show, onHide }) {
  const { actionsLoading, modelTypeFetchedById } = useSelector(
    (state) => ({
      actionsLoading: state.modelType.actionsLoading,
      modelTypeFetchedById: state.modelType.modelTypeFetchedById,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== null && id !== undefined) {
      dispatch(action.fetchModelTypeById(id));
    } else {
      dispatch(actions.clearModelTypeById());
    }
  }, [id, dispatch]);

  const [loading, setLoading] = useState(false);
  const saveModelType = (modelType) => {
    setLoading(true);
    if (!id) {
      // server request for creating modelType
      dispatch(action.createModelType(modelType)).then(() => onHide());
    } else {
      // server request for updating modelType
      dispatch(action.modelTypeUpdate(modelType)).then(() => {
        successToast("Model type updated successfully");
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
      <ModelTypeEditDialogHeader id={id} />
      <ModelTypeEditForm
        saveModelType={saveModelType}
        actionsLoading={actionsLoading}
        modelTypeData={modelTypeFetchedById}
        onHide={onHide}
      />
    </Modal>
  );
}
