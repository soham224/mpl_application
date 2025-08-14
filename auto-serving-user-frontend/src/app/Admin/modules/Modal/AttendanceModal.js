import React, { Component, Fragment } from "react";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  FormFeedback,
} from "reactstrap";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import Switch from "@material-ui/core/Switch/Switch";
import { successToast, warningToast } from "../../../../utils/ToastMessage";
import {
  addCompanySettings,
  updateCompanySettings,
} from "../Attendance/_redux";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';
import moment from "moment";

class AttendanceModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isUpdate: props.isUpdate,
      startTime: "10:30",
      endTime: "19:30",
      bufferTime: "",
      camera: { label: "Select Camera", value: 0 },
      checked: false,
      cameraOptions: props.cameraOptions,
      errors: {},
      msg: {},
      userId: props.userId,
      settings: {},
      id: null,
      blocking: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.isUpdate) {
      this.setState({
        settings: nextProps.settings,
        isOpen: nextProps.isOpen,
        startTime: moment
          .utc(nextProps.settings["start_time"], "HH:mm")
          .local()
          .format("HH:mm"),
        endTime: moment
          .utc(nextProps.settings["end_time"], "HH:mm")
          .local()
          .format("HH:mm"),
        bufferTime: nextProps.settings["buffer_time"],
        checked: nextProps.settings["is_used_camera"],
        camera: nextProps.currentCamera,
        isUpdate: nextProps.isUpdate,
        cameraOptions: nextProps.cameraOptions,
        id: nextProps.settings["id"],
        userId: nextProps.userId,
        errors: {},
      });
    } else {
      this.setState({
        isOpen: nextProps.isOpen,
        cameraOptions: nextProps.cameraOptions,
        userId: nextProps.userId,
      });
    }
  }

  handleChange(e) {
    let errors = this.state.errors;
    const name = e.target.name;
    if (name === "startTime" || name === "endTime") {
      errors["timeDiff"] = false;
    }
    errors[name] = false;
    this.setState({
      [name]: e.target.value,
      errors: errors,
    });
  }

  handleChange2() {
    this.setState({
      checked: !this.state.checked,
    });
  }

  handleCameraChange(cam) {
    let errors = this.state.errors;
    errors["camera"] = false;
    this.setState({
      camera: cam,
      errors: errors,
    });
  }
  checkErrors = () => {
    const { bufferTime, camera, startTime, endTime, errors, msg } = this.state;
    if (startTime === "" || startTime === null) {
      errors["startTime"] = true;
      msg["startTime"] = "This field is required";
      this.setState({
        errors: errors,
        msg: msg,
      });
    }
    if (endTime === "" || endTime === null) {
      errors["endTime"] = true;
      msg["endTime"] = "This field is required";
      this.setState({
        errors: errors,
        msg: msg,
      });
    }
    if (bufferTime === "" || bufferTime === null) {
      errors["bufferTime"] = true;
      msg["bufferTime"] = "This field is required";
      this.setState({
        errors: errors,
        msg: msg,
      });
    } else if (
      isNaN(bufferTime) ||
      parseInt(bufferTime) < 0 ||
      parseInt(bufferTime) > 60
    ) {
      errors["bufferTime"] = true;
      msg["bufferTime"] = "Please enter a number between 0 to 60";
      this.setState({
        errors: errors,
        msg: msg,
      });
    }
    if (camera.value === 0) {
      errors["camera"] = true;
      msg["camera"] = "This field is required";
      this.setState({
        errors: errors,
        msg: msg,
      });
    }
    if (
      startTime !== "" ||
      endTime !== "" ||
      startTime !== null ||
      endTime !== null
    ) {
      let stTime = startTime.split(":");
      let edTime = endTime.split(":");
      if (parseInt(stTime[0]) > parseInt(edTime[0])) {
        errors["timeDiff"] = true;
        msg["timeDiff"] = "Start time must be smaller than End time";
        this.setState({
          errors: errors,
          msg: msg,
        });
      } else if (parseInt(stTime[0]) === parseInt(edTime[0])) {
        if (parseInt(stTime[1]) >= parseInt(edTime[1])) {
          errors["timeDiff"] = true;
          msg["timeDiff"] = "Start time must be smaller than End time";
          this.setState({
            errors: errors,
            msg: msg,
          });
        }
      }
    }
    return errors;
  };
  handleSubmit() {
    const {
      isUpdate,
      bufferTime,
      camera,
      checked,
      startTime,
      endTime,
      userId,
    } = this.state;
    let errors = this.checkErrors();
    if (!Object.values(errors).includes(true)) {
      let body = {
        start_time: new Date(
          new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate() +
            " " +
            startTime
        )
          .toISOString()
          .split("T")[1]
          .toString()
          .substring(0, 5),
        end_time: new Date(
          new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate() +
            " " +
            endTime
        )
          .toISOString()
          .split("T")[1]
          .toString()
          .substring(0, 5),
        buffer_time: bufferTime,
        camera_id: camera.value,
        company_id: userId,
        is_used_camera: checked,
        status: true,
      };
      if (!isUpdate) {
        this.setState({ blocking: true });
        addCompanySettings(body)
          .then((res) => {
            if (res && res.isSuccess) {
              this.setState({ blocking: false });
              successToast("Successfully added camera settings");
              this.props.onUpdate();
              this.props.toggleOpen();
            } else {
              this.setState({ blocking: false });
              warningToast("Something went wrong");
            }
          })
          .catch((error) => {
            this.setState({ blocking: false });
            if (error.detail) {
              warningToast(error.detail);
            } else {
              warningToast("Something went Wrong");
            }
          });
      } else {
        this.setState({ blocking: true });
        body["id"] = this.state.id;
        updateCompanySettings(body)
          .then((res) => {
            if (res && res.isSuccess) {
              this.setState({ blocking: false });
              successToast("Successfully updated camera settings");
              this.props.onUpdate();
              this.props.toggleOpen();
            } else {
              this.setState({ blocking: false });
              warningToast("Something went wrong");
            }
          })
          .catch((error) => {
            this.setState({ blocking: false });
            if (error.detail) {
              warningToast(error.detail);
            } else {
              warningToast("Something went Wrong");
            }
          });
      }
    }
  }

  render() {
    const {
      isOpen,
      isUpdate,
      bufferTime,
      camera,
      checked,
      cameraOptions,
      msg,
      errors,
      startTime,
      endTime,
    } = this.state;
    return (
      <Fragment>
        <BlockUi blocking={this.state.blocking}>
          <Modal
            isOpen={isOpen}
            toggle={this.props.toggleOpen}
            backdrop="static"
          >
            <ModalHeader>
              <div style={{ width: "100%", float: "left" }}>
                <h2>{isUpdate ? "Update" : "Add"} Configuration</h2>
              </div>
            </ModalHeader>
            <ModalBody>
              <>
                <Form>
                  <FormGroup>
                    <Label>Start Time</Label>
                    <TextField
                      style={{
                        position: "absolute",
                        left: "150px",
                        width: "20%",
                      }}
                      id="time"
                      type="time"
                      name={"startTime"}
                      value={startTime}
                      onChange={(e) => this.handleChange(e)}
                      inputProps={{
                        step: 300, // 5 min
                      }}
                    />
                    <br />
                    <span
                      style={{
                        color: "red",
                        display: !errors["startTime"] ? "None" : "",
                      }}
                    >
                      {msg["startTime"]}
                    </span>
                  </FormGroup>
                </Form>

                <Form>
                  <FormGroup>
                    <Label>End Time</Label>
                    <TextField
                      style={{
                        position: "absolute",
                        left: "150px",
                        width: "20%",
                      }}
                      id="time"
                      type="time"
                      name={"endTime"}
                      value={endTime}
                      onChange={(e) => this.handleChange(e)}
                      inputProps={{
                        step: 300, // 5 min
                      }}
                    />
                    <br />
                    <span
                      style={{
                        color: "red",
                        display: !errors["endTime"] ? "None" : "",
                      }}
                    >
                      {msg["endTime"]}
                    </span>
                  </FormGroup>
                </Form>
                <span
                  style={{
                    color: "red",
                    display: !errors["timeDiff"] ? "None" : "",
                  }}
                >
                  {msg["timeDiff"]}
                </span>
                <Form>
                  <FormGroup>
                    <Row>
                      <Col md={3}>
                        <Label>Buffer Time</Label>
                      </Col>
                      <Col md={9}>
                        <Input
                          invalid={errors["bufferTime"]}
                          type={"text"}
                          name={"bufferTime"}
                          value={bufferTime}
                          onChange={(e) => {
                            this.handleChange(e);
                          }}
                        />
                        <FormFeedback>{msg["bufferTime"]}</FormFeedback>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md={3}>
                        <Label>Camera</Label>
                      </Col>
                      <Col md={9}>
                        <Select
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors,
                              primary25: "#5DBFC4",
                              primary: "#147b82",
                            },
                          })}
                          name="camera"
                          className="select-react-dropdown"
                          options={cameraOptions}
                          onChange={(c) => {
                            this.handleCameraChange(c);
                          }}
                          value={camera}
                        />
                        <span
                          style={{
                            color: "red",
                            display: !errors["camera"] ? "None" : "",
                          }}
                        >
                          {msg["camera"]}
                        </span>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md={3}>
                        <Label>Is Used Camera</Label>
                      </Col>
                      <Col md={1}>
                        <Switch
                          name={"checked"}
                          checked={checked}
                          onChange={() => this.handleChange2()}
                          color="primary"
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                </Form>
              </>
            </ModalBody>
            <ModalFooter>
              <Row className={"m-0"} style={{ width: "100%" }}>
                <Col className={"p-0"} xl={12}>
                  <div style={{ width: "100%", textAlign: "end" }}>
                    <Button
                      style={{ paddingLeft: "10px", paddingRight: "10px" }}
                      className={"mr-2 btn-apply-filter"}
                      onClick={() => this.handleSubmit()}
                      size="lg"
                    >
                      {isUpdate ? "Update" : "Add"} Configuration
                    </Button>
                    <Button
                      className={"close-filter-btn"}
                      onClick={this.props.toggleOpen}
                      size="lg"
                    >
                      Close
                    </Button>
                  </div>
                </Col>
              </Row>
            </ModalFooter>
          </Modal>
        </BlockUi>
      </Fragment>
    );
  }
}

export default AttendanceModal;
