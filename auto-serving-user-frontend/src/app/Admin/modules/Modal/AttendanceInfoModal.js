import React, { Component, Fragment } from "react";
import { Button, Modal } from "react-bootstrap";
import { dateTimeFormatter } from "../../../../utils/DateTimeFormatter";
import * as moment from "moment";

class AttendanceInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.isOpen,
      data: props.data[0],
      checked: props.settings["is_used_camera"],
      createdDate: props.settings["created_date"],
      updatedDate: props.settings["updated_date"]
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      show: nextProps.isOpen,
      data: nextProps.data[0],
      checked: nextProps.settings["is_used_camera"],
      createdDate: nextProps.settings["created_date"],
      updatedDate: nextProps.settings["updated_date"]
    });
  }

  render() {
    const { data, show, checked } = this.state;
    return (
      <Fragment>
        <Modal
          size="lg"
          show={show}
          onHide={this.props.onHide}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Attendance
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
                Camera Settings
              </span>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Start Time</b>
                </span>
              </div>

              <div className="col col-md-6">
                {moment
                  .utc(data?.startTime, "HH:mm")
                  .local()
                  .format("hh:mm A")}
              </div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>End Time</b>
                </span>
              </div>
              <div className="col col-md-6">
                {moment
                  .utc(data?.endTime, "HH:mm")
                  .local()
                  .format("hh:mm A")}
              </div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Buffer Time</b>
                </span>
              </div>
              <div className="col col-md-6">{data?.bufferTime}</div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Camera</b>
                </span>
              </div>
              <div className="col col-md-6">{data?.camera}</div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Is Used Camera</b>
                </span>
              </div>
              <div className="col col-md-6">{checked ? "True" : "False"}</div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Created Date</b>
                </span>
              </div>
              <div className="col col-md-6">
                {dateTimeFormatter(this.state.createdDate)}
              </div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Updated Date</b>
                </span>
              </div>
              <div className="col col-md-6">
                {dateTimeFormatter(this.state.updatedDate)}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              onClick={this.props.onHide}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

export default AttendanceInfoModal;
