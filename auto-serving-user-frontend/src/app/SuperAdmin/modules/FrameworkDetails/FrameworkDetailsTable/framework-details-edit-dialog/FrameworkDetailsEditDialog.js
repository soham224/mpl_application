import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FrameworkDetailsEditDialogHeader } from "./FrameworkDetailsEditDialogHeader";
import { FrameworkDetailsEditForm } from "./FrameworkDetailsEditForm";
import * as action from "../../_redux/FrameworkDetailsAction";
import { FrameworkDetailsSlice } from "../../_redux/FrameworkDetailsSlice";
import { SavingDetailsModal } from "../../../../../../utils/SavingDetailsModal";
import { successToast } from "../../../../../../utils/ToastMessage";

const { actions } = FrameworkDetailsSlice;

export function FrameworkDetailsEditDialog({ id, show, onHide }) {
  const { actionsLoading, frameworkFetchedById } = useSelector(
    (state) => ({
      actionsLoading: state.frameworkDetails.actionsLoading,
      frameworkFetchedById: state.frameworkDetails.frameworkDetailsFetchedById,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== null && id !== undefined) {
      dispatch(action.fetchFrameworkDetailsById(id));
    } else {
      dispatch(actions.clearFrameworkDetailsById());
    }
  }, [id, dispatch]);

  const [loading, setLoading] = useState(false);
  const saveFrameWorkDetails = (framework) => {
    setLoading(true);
    if (!id) {
      // server request for creating framework details
      dispatch(action.createFrameworkDetails(framework)).then(() => onHide());
    } else {
      // server request for updating framework details
      dispatch(action.frameworkDetailsUpdate(framework)).then(() => {
        successToast("Framework details updated successfully");
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
      <FrameworkDetailsEditDialogHeader id={id} />
      <FrameworkDetailsEditForm
        saveFrameworkDetails={saveFrameWorkDetails}
        actionsLoading={actionsLoading}
        frameworkData={frameworkFetchedById}
        onHide={onHide}
      />
    </Modal>
  );
}
