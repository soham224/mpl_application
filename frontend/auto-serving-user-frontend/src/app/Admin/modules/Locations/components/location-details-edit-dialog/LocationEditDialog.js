import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { LocationEditDialogHeader } from "./LocationEditDialogHeader";
import { LocationEditForm } from "./LocationEditForm";
import * as action from "../../_redux/LocationAction";
import { LocationSlice } from "../../_redux/LocationSlice";
import { addNotification } from "../../../Notification/_redux/notification";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

const { actions } = LocationSlice;

export function LocationEditDialog({ id, show, onHide }) {
  const { actionsLoading, locationFetchedById } = useSelector(
    (state) => ({
      actionsLoading: state.location.actionsLoading,
      locationFetchedById: state.location.locationFetchedById,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== null && id !== undefined) {
      dispatch(action.fetchLocationById(id));
    } else {
      dispatch(actions.clearLocationById());
    }
  }, [id, dispatch]);

  const { user } = useSelector(
    ({ auth }) => ({
      user: auth.user,
    }),
    shallowEqual
  );

  const saveLocationDetails = (location) => {
    if (!id) {
      dispatch(action.createLocation(location, user.id)).then(() => {
        dispatch(action.fetchLocation());
        onHide();
      });
    } else {
      dispatch(action.locationUpdate(location, user.company_id)).then(() => {
        let data2 = {
          notification_message: "Location Updated : " + location.locationName,
          user_id: user.id,
          type_of_notification: "string",
          status: true,
          is_unread: true,
        };
        dispatch(action.fetchLocation());
        onHide();
        addNotification(data2).then((response) => {
          if (response && response.isSuccess) {
          }
        });
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
      <LocationEditDialogHeader id={id} />
      <BlockUi tag="div" blocking={actionsLoading} color="#147b82">
        <LocationEditForm
          saveLocation={saveLocationDetails}
          actionsLoading={actionsLoading}
          locationData={locationFetchedById}
          onHide={onHide}
        />
      </BlockUi>
    </Modal>
  );
}
