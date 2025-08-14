import React from "react";
import { Button, Modal } from "react-bootstrap";

function CompanyServiceInfo({ infoModalShow, handleInfoClose,infoData }) {
  return (
    <>
      <Modal
        size="lg"
        show={infoModalShow}
        onHide={handleInfoClose}
        aria-labelledby="example-modal-sizes-title-lg"
        backdrop={ 'static' }
        keyboard={ false }
      >
        <Modal.Header closeButton={handleInfoClose}>
          <Modal.Title id="example-modal-sizes-title-lg">
            User Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row col-12 view-title text-center">
            <span
              className="w-100 font-weight-bold"
              style={{
                background: "#147b82",
                color: "white",
                margin: "20px auto"
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
            <div className="col col-md-6">
              {infoData?.company?.company_address}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-md-6">
              <span>
                <b>Company Description</b>
              </span>
            </div>
            <div className="col col-md-6">
              {infoData?.company?.company_description}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-md-6">
              <span>
                <b>Company Pincode</b>
              </span>
            </div>
            <div className="col col-md-6">
              {infoData?.company?.company_pin_code}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-md-6">
              <span>
                <b>Company POC</b>
              </span>
            </div>
            <div className="col col-md-6">
              {infoData?.company?.company_poc}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-md-6">
              <span>
                <b>Company POC Contact</b>
              </span>
            </div>
            <div className="col col-md-6">
              {infoData?.company?.company_poc_contact}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-md-6">
              <span>
                <b>Created Date</b>
              </span>
            </div>
            <div className="col col-md-6">
              {infoData?.company?.created_date}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-md-6">
              <span>
                <b>Updated Date</b>
              </span>
            </div>
            <div className="col col-md-6">
              {infoData?.company?.updated_date}
            </div>
          </div>
          {/*<div className="row mt-4">*/}
          {/*  <div className="col col-md-6">*/}
          {/*    <span>*/}
          {/*      <b>Updated Date</b>*/}
          {/*    </span>*/}
          {/*  </div>*/}
          {/*  <div className="col col-md-6">*/}
          {/*    {infoData?.company?.updated_date}*/}
          {/*  </div>*/}
          {/*</div>*/}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            onClick={handleInfoClose}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CompanyServiceInfo;
