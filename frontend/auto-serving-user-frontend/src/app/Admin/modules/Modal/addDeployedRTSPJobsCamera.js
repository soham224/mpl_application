import React, { Component, Fragment } from "react";
import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Row,
  Card,
  CardBody,
} from "reactstrap";
import { getEnabledLocationList } from "../AddSupervisor/_redux";
import Select from "react-select";
import { updateDeploymentCamera } from "./_redux";
import { successToast, warningToast } from "../../../../utils/ToastMessage";
import Switch from "@material-ui/core/Switch/Switch";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

export default class AddDeployedRTSPJobsCamera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: null,
      isUpdate: null,
      rtsp_url: null,
      camera_ip: null,
      camera_location: null,
      camera_name: null,
      process_fps: null,
      camera_resolution: "640:640",
      locationOptions: [],
      disableFields: true,
      checked: false,
      isValid: false,
      disableButton: false,
      errors: {},
      blocking: false,
    };
  }

  componentDidMount() {
    this.setState({
      modalOpen: this.props.modalOpen,
      isUpdate: this.props.isUpdate,
      errors: {},
    });
    this.populateLocationList();
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      modalOpen: nextProps.modalOpen,
    });
    if (nextProps.modalOpen) {
      let cameraSet = nextProps.cameraSettings;
      this.setState({
        disableFields: false,
        rtsp_url: cameraSet?.rtsp_url || null,
        camera_ip: cameraSet?.camera_ip || null,
        camera_location: cameraSet?.location_id || null,
        camera_name: cameraSet?.camera_name || null,
        process_fps: cameraSet?.process_fps,
        camera_resolution: cameraSet?.camera_resolution || "640:640",
        is_active: nextProps.cameraSettings.is_active,
        is_processing: nextProps.cameraSettings.is_processing,
        deployment_job_rtsp_id: nextProps.cameraSettings.deployment_job_rtsp_id,
        is_tcp: nextProps.cameraSettings.is_tcp,
        roi_type: nextProps.cameraSettings.roi_type,
        roi_url: nextProps.cameraSettings.roi_url,
        status: nextProps.cameraSettings.status,
        id: nextProps.cameraSettings.id,
        errors: {},
        checked: false,
      });
    }
  }

  updateCamera = () => {
    const errors = this.checkErrors();
    if (!Object.values(errors).includes(true)) {
      const cameraData = {
        rtsp_url: this.state.rtsp_url,
        camera_name: this.state.camera_name,
        camera_resolution: this.state.camera_resolution,
        process_fps: this.state.process_fps,
        location_id: this.state.camera_location,
        camera_ip: this.state.camera_ip,
        roi_type: this.state.roi_type,
        is_active: this.state.is_active,
        is_processing: this.state.is_processing,
        deployment_job_rtsp_id: this.state.deployment_job_rtsp_id,
        is_tcp: this.state.is_tcp,
        roi_url: this.state.roi_url,
        status: this.state.status,
        id: this.state.id,
      };

      this.setState(
        {
          blocking: true,
        },
        () => {
          updateDeploymentCamera(cameraData).then((res) => {
            if (res && res.isSuccess) {
              successToast("Camera updated successfully");
              this.props.toogleCameraModal();
              this.props.onHide(false);
            }
            this.setState({ blocking: false });
          });
        }
      );
    }
  };

  checkErrors = () => {
    let {
      camera_name,
      camera_resolution,
      process_fps,
      camera_ip,
      camera_location,
      errors,
    } = this.state;
    if (camera_name === "" || camera_name === null) {
      errors["camera_name"] = true;
      this.setState({
        errors: errors,
      });
    }
    if (camera_resolution === "" || camera_resolution === null) {
      errors["camera_resolution"] = true;
      this.setState({
        errors: errors,
      });
    }
    if (camera_location === null) {
      errors["camera_location"] = true;
      this.setState({
        errors: errors,
      });
    }
    if (
      process_fps === null ||
      process_fps === "" ||
      isNaN(process_fps) ||
      parseInt(process_fps) <= 2
    ) {
      errors["process_fps"] = true;
      this.setState({
        errors: errors,
      });
    }
    if (camera_ip === null) {
      camera_ip = "";
    }
    if (
      !camera_ip.match(
        /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      )
    ) {
      errors["camera_ip"] = true;
      this.setState({
        errors: errors,
      });
    }
    return errors;
  };

  addCamera = () => {
    let errors = this.checkErrors();
    if (!Object.values(errors).includes(true)) {
      const addcameraData = {
        rtsp_url: this.state.rtsp_url,
        camera_name: this.state.camera_name,
        camera_resolution: this.state.camera_resolution,
        process_fps: this.state.process_fps,
        location_id: this.state.camera_location,
        camera_ip: this.state.camera_ip,
        deploymentJobId: this.props.rtspId,
        roi_type: this.state.checked,
      };
      this.setState(
        {
          blocking: true,
        });
    }
  };

  handleOnChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const errors = this.state.errors;
    errors[name] = false;
    this.setState({
      [name]: value,
      errors: errors,
    });
  };

  handleLocationChange = (selectedLocation) => {
    const errors = this.state.errors;
    errors["camera_location"] = false;
    this.setState({
      selectedLocation,
      camera_location: selectedLocation.value,
      errors: errors,
    });
  };

  populateLocationList = () => {
    getEnabledLocationList()
      .then((response) => {
        // eslint-disable-next-line
        let companyList = [];
        if (response && response.data) {
          let list = this.generateOptions(response.data);
          this.setState({
            locationOptions: list,
          });
        }
      })
      .catch((error) => {
        if (error.detail) {
          warningToast(error.detail);
        } else {
          warningToast("Something went Wrong");
        }
      });
  };

  generateOptions = (array) => {
    let options = [];
    for (let y = 0; y < array.length; y++) {
      let data = array[y];
      let replaced = data.location_name;
      let id = data.id;
      options.push({
        value: id,
        label: replaced,
      });
    }
    return options;
  };

  validateRTSPURL = () => {
    let rtspUrl = this.state.rtsp_url;
    const errors = this.state.errors;
    if (this.state.rtsp_url) {
      this.setState(
        {
          blocking: true,
        },
      );
    }
  };

  handleChange2 = (e) => {
    this.setState({
      checked: !this.state.checked,
    });
  };

  render() {
    // eslint-disable-next-line
    const { settings } = this.props;
    const { errors } = this.state;
    return (
      <Fragment>
        <Modal
          isOpen={this.state.modalOpen}
          toggle={this.props.toogleCameraModal}
          backdrop="static"
        >
          <ModalHeader>
            <div style={{ width: "100%", float: "left" }}>
              {this.props.isUpdate ? (
                <h2>Update Camera</h2>
              ) : (
                <h2>Add Camera</h2>
              )}
            </div>
          </ModalHeader>
          <ModalBody>
            <BlockUi blocking={this.state.blocking}>
              <Row>
                <Col xl={12}>
                  <Card>
                    <CardBody>
                      <Label>RTSP URL</Label>
                      <Input
                        name="rtsp_url"
                        defaultValue={this.state.rtsp_url}
                        onBlur={this.validateRTSPURL}
                        onChange={this.handleOnChange}
                      />
                      <span
                        style={{
                          color: "red",
                          display: !errors["rtsp_url"] ? "None" : "",
                        }}
                      >
                        Please Enter valid RTSP URL
                        <br />
                      </span>

                      <Label>Camera Ip</Label>
                      <Input
                        name="camera_ip"
                        disabled={this.state.disableFields}
                        defaultValue={this.state.camera_ip}
                        onChange={this.handleOnChange.bind(this)}
                      />
                      <span
                        style={{
                          color: "red",
                          display: !errors["camera_ip"] ? "None" : "",
                        }}
                      >
                        Please Enter valid Camera IP
                        <br />
                      </span>

                      <Label>Camera Location</Label>
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
                        isSearchable={false}
                        isMulti={false}
                        placeholder="Select Location"
                        isDisabled={this.state.disableFields}
                        value={this.state.locationOptions.filter(
                          (option) =>
                            option.value === this.state.camera_location
                        )}
                        onChange={this.handleLocationChange}
                        options={this.state.locationOptions}
                      />
                      <span
                        style={{
                          color: "red",
                          display: !errors["camera_location"] ? "None" : "",
                        }}
                      >
                        Please Select a Camera Location
                        <br />
                      </span>
                      {/*<Input name="camera_location" defaultValue={this.state.camera_location} onChange={this.handleOnChange} />*/}

                      <Label>Camera Name</Label>
                      <Input
                        disabled={this.state.disableFields}
                        name="camera_name"
                        defaultValue={this.state.camera_name}
                        onChange={this.handleOnChange}
                      />
                      <span
                        style={{
                          color: "red",
                          display: !errors["camera_name"] ? "None" : "",
                        }}
                      >
                        This field is required
                        <br />
                      </span>

                      <Label>Process fps</Label>
                      <Input
                        disabled={this.state.disableFields}
                        name="process_fps"
                        defaultValue={this.state.process_fps}
                        onChange={this.handleOnChange}
                      />
                      <span
                        style={{
                          color: "red",
                          display: !errors["process_fps"] ? "None" : "",
                        }}
                      >
                        Process FPS value must be greater than 3<br />
                      </span>

                      <Label>Camera Resolution</Label>
                      <Input
                        disabled={true}
                        name="camera_resolution"
                        defaultValue={"640:640"}
                        value={this.state.camera_resolution}
                        onChange={this.handleOnChange}
                      />
                      <span
                        style={{
                          color: "red",
                          display: !errors["camera_resolution"] ? "None" : "",
                        }}
                      >
                        This field is required
                        <br />
                      </span>

                      {!this.props.isUpdate && (
                        <>
                          <Label>Roi type</Label>
                          <br />
                          <Switch
                            checked={this.state.checked}
                            onChange={this.handleChange2}
                            color="primary"
                          />
                          <br />
                        </>
                      )}

                      <hr />
                      <div className={"mt-4"} style={{ textAlign: "end" }}>
                        {this.props.isUpdate ? (
                          <Button
                            disabled={this.state.disableButton}
                            onClick={this.updateCamera}
                          >
                            Update
                          </Button>
                        ) : (
                          <Button
                            disabled={this.state.disableButton}
                            onClick={this.addCamera}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </BlockUi>
          </ModalBody>
          <ModalFooter>
            <div style={{ width: "100%", textAlign: "end" }}>
              <Button onClick={this.props.toogleCameraModal}>Close</Button>
            </div>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}
