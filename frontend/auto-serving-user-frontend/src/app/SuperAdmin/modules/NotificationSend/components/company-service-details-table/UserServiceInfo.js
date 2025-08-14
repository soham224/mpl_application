import React from "react";
import { Button, Modal } from "react-bootstrap";

function UserServiceInfo({ infoModalShow, handleInfoClose, infoData }) {
  return (
    <>
      <Modal
        size="lg"
        show={infoModalShow}
        onHide={handleInfoClose}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        style={{background : "#00000080"}}
      >
        <Modal.Header closeButton={handleInfoClose}>
          <Modal.Title id="example-modal-sizes-title-lg">
            User Service Information
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
              User Service
            </span>
          </div>
          <div className="row">
            <div className="col col-md-6">
              <span>
                <b>Company Name</b>
              </span>
            </div>
            <div className="col col-md-6">
              {infoData?.company?.company_address}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-md-6">
              <span>
                <b>Whatsapp Number</b>
              </span>
            </div>
            <div className="col col-md-6">
              {infoData?.company?.company_description}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col col-md-6">
              <span>
                <b>Company Due Date</b>
              </span>
            </div>
            <div className="col col-md-6">
              {infoData?.company?.company_pin_code}
            </div>
          </div>
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

export default UserServiceInfo;
