import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { UserSlice } from "../../_redux/UserSlice";
import { UsersDetailsForm } from "./UsersDetailsForm";
import { dateTimeFormatter } from "../../../../../../utils/DateTimeFormatter";

const { actions } = UserSlice;

export function UsersDetailsDialog({ id, show, onHide }) {
  const dispatch = useDispatch();
  const { actionsLoading, entities, userDetails } = useSelector(
    state => ({
      actionsLoading: state.users.actionsLoading,
      entities: state.users.entities,
      userDetails: state.users.userDetails
    }),
    shallowEqual
  );

  const getUserDetails = id => {
    //eslint-disable-next-line
    entities &&
      entities.map(items => {
        let i = parseInt(id);
        if (items.id === i) {
          const data = {
            viewComapanyAddress: items.company.company_address,
            viewCompanyDescription: items.company.company_description,
            viewCompanyPincode: items.company.company_pin_code,
            viewCompanyPoc: items.company.company_poc,
            viewCompanyPocContact: items.company.company_poc_contact,
            viewCreatedDate: dateTimeFormatter(items.company.created_date),
            viewUpdatedDate: dateTimeFormatter(items.company.updated_date)
          };
          dispatch(actions.viewUserDetails(data));
        }
        return null;
      });
  };

  useEffect(() => {
    getUserDetails(id);
    //eslint-disable-next-line
  }, [id]);

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          User Details
        </Modal.Title>
      </Modal.Header>
      <UsersDetailsForm
        actionsLoading={actionsLoading}
        userDetails={userDetails}
        onHide={onHide}
      />
    </Modal>
  );
}
