/* eslint-disable */
import React, { Component, Fragment } from "react";
import Switch from "@material-ui/core/Switch/Switch";
import SweetAlert from "react-bootstrap-sweetalert";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { Button } from "reactstrap";
import AddDeployedRTSPJobsCamera from "./addDeployedRTSPJobsCamera";

export default class DeployedRTSPJobsCameraSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraSettings: null,
      modalOpen: false,
      showModal: true
    };
  }

  openAddModal = () => {
    this.setState(
      {
        cameraSettings: [],
        isUpdate: false
      },
      () => {
        this.toogleCameraModal();
      }
    );
  };

  openAddUpdateModal = settings => {
    this.setState(
      {
        cameraSettings: settings,
        isUpdate: true
      },
      () => {
        this.toogleCameraModal();
      }
    );
  };

  toogleCameraModal = () => {
    this.setState(
      {
        modalOpen: !this.state.modalOpen
      },
      () => {
        if (this.state.modalOpen === false) {
          this.setState({
            isUpdate: false
          });
        }
      }
    );
  };

  render() {
    const { settings, rtspId, isSuccess } = this.props;
    return (
      <Fragment>
        <div>
          <Button
            className={"mb-4 mt-3"}
            style={{ float: "right" }}
            onClick={() => this.openAddModal()}
          >
            Add new camera
          </Button>
        </div>
        {!settings.length ? (
          <div className="row col-12 view-title">
            <span className="w-100 font-weight-bold">No Cameras Found!</span>
          </div>
        ) : null}
        {settings.map((setting, index) => (
          <>
            <div className="row col-12 view-title">
              <span className="w-100 font-weight-bold">
                Camera {index + 1} Details
              </span>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Camera IP</b>
                </span>
              </div>
              <div className="col col-md-6">{setting?.camera_ip}</div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Camera Name</b>
                </span>
              </div>
              <div className="col col-md-6">{setting?.camera_name}</div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Camera Resolution</b>
                </span>
              </div>
              <div className="col col-md-6">{setting?.camera_resolution}</div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Process FPS</b>
                </span>
              </div>
              <div className="col col-md-6">{setting?.process_fps}</div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>RTSP URL</b>
                </span>
              </div>
              <div className="col col-md-6">
                <a style={{ wordBreak: "break-all" }} href={setting?.rtsp_url}>
                  {setting?.rtsp_url}
                </a>
              </div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Is Active</b>
                </span>
              </div>
              <div className="col col-md-6">
                {setting?.is_active ? (
                  <CheckIcon color={"primary"} style={{ fontSize: "2rem" }} />
                ) : (
                  <ClearIcon color={"error"} style={{ fontSize: "2rem" }} />
                )}
              </div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Is Processing</b>
                </span>
              </div>
              <div className="col col-md-6">
                {setting?.is_processing ? (
                  <CheckIcon color={"primary"} style={{ fontSize: "2rem" }} />
                ) : (
                  <ClearIcon color={"error"} style={{ fontSize: "2rem" }} />
                )}
              </div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Is TCP</b>
                </span>
              </div>
              <div className="col col-md-6">
                {setting?.is_tcp ? (
                  <CheckIcon color={"primary"} style={{ fontSize: "2rem" }} />
                ) : (
                  <ClearIcon color={"error"} style={{ fontSize: "2rem" }} />
                )}
              </div>
            </div>
            <div className="row mt-2 mb-2">
              <div className="col col-md-6">
                <span>
                  <b>Status</b>
                </span>
              </div>
              <Switch
                checked={setting?.status}
                onChange={() =>
                  this.props.ShowAlertForSetting(setting?.id, !setting?.status)
                }
                color="primary"
              />
            </div>
            <div>
              <Button
                onClick={() => this.openAddUpdateModal(setting)}
                className={"mb-4 mt-3"}
                style={{ float: "right" }}
              >
                Update settings
              </Button>
            </div>
            <SweetAlert
              info={!isSuccess}
              success={isSuccess}
              showCancel={!isSuccess}
              showConfirm={!isSuccess}
              confirmBtnText="Confirm"
              confirmBtnBsStyle="primary"
              cancelBtnBsStyle="light"
              cancelBtnStyle={{ color: "black" }}
              title={`${
                isSuccess
                  ? "Status Changed Successfully"
                  : "Are you sure ? to Change the Status"
              }`}
              onConfirm={() => this.props.changeCameraSettingStatus()}
              onCancel={() => this.props.setShowAlert(false)}
              show={this.props.showAlert}
              focusCancelBtn
            />
          </>
        ))}
        <AddDeployedRTSPJobsCamera
          onHide={this.props.onHide}
          isUpdate={this.state.isUpdate}
          toogleCameraModal={this.toogleCameraModal}
          modalOpen={this.state.modalOpen}
          cameraSettings={this.state.cameraSettings}
          rtspId={rtspId}
        />
      </Fragment>
    );
  }
}
