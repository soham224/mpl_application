import React from "react";
import { Button, Modal } from "react-bootstrap";

export function UsersDetailsForm({ userDetails, onHide }) {
  return (
    <>
      <Modal.Body>
        <div className="row col-12 view-title text-center">
          <span
            className="w-100 font-weight-bold"
            style={{
              background: "#147b82",
              color: "white",
              margin: "20px auto",
            }}
          >
            User Details
          </span>
        </div>
        <div className="row">
          <div className="col col-md-6">
            <span>
              <b>Company Address</b>
            </span>
          </div>
          <div className="col col-md-6">{userDetails.viewComapanyAddress}</div>
        </div>
        <div className="row mt-4">
          <div className="col col-md-6">
            <span>
              <b>Company Description</b>
            </span>
          </div>
          <div className="col col-md-6">
            {userDetails.viewCompanyDescription}
          </div>
        </div>
        <div className="row mt-4">
          <div className="col col-md-6">
            <span>
              <b>Company Pincode</b>
            </span>
          </div>
          <div className="col col-md-6">{userDetails.viewCompanyPincode}</div>
        </div>
        <div className="row mt-4">
          <div className="col col-md-6">
            <span>
              <b>Company POC</b>
            </span>
          </div>
          <div className="col col-md-6">{userDetails.viewCompanyPoc}</div>
        </div>
        <div className="row mt-4">
          <div className="col col-md-6">
            <span>
              <b>Company POC Contact</b>
            </span>
          </div>
          <div className="col col-md-6">
            {userDetails.viewCompanyPocContact}
          </div>
        </div>
        <div className="row mt-4">
          <div className="col col-md-6">
            <span>
              <b>Created Date</b>
            </span>
          </div>
          <div className="col col-md-6">{userDetails.viewCreatedDate}</div>
        </div>
        <div className="row mt-4">
          <div className="col col-md-6">
            <span>
              <b>Updated Date</b>
            </span>
          </div>
          <div className="col col-md-6">{userDetails.viewUpdatedDate}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </>
  );
}
