/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { warningToast } from "../../../../../../../../utils/ToastMessage";
import { updateCameraSettingRTSPStatus } from "../../../../_redux/DeployedRTSPJobs/deployedRTSPJobsSettings.api";
import { CustomInput } from "reactstrap";
import * as actions from "../../../../_redux/DeployedRTSPJobs/DeployedRTSPJobsAction";
import SweetAlert from "react-bootstrap-sweetalert";

export function DeployedRTSPJobsCameraSettingsDialog({
  id,
  show,
  onHide,
  history
}) {
  const dispatch = useDispatch();
  const { entities } = useSelector(
    state => ({
      entities: state.deployedRTSPJobs.entities
    }),
    shallowEqual
  );

  const [settings, setSettings] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [newSetting, setNewSetting] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      const rtspJob = entities?.filter(job => job.id === id * 1);
      if (rtspJob?.length) {
        setSettings(
          rtspJob[0]?.deployment_job_rtsp_details?.camera_settings || []
        );
      }
    }
  }, [id, entities]);

  const changeCameraSettingStatus = () => {
    updateCameraSettingRTSPStatus(newSetting.id, newSetting.status)
      .then(response => {
        if (response && response.isSuccess) {
          dispatch(actions.fetchDeployedRTSPJobs()).then(() =>
            setIsSuccess(true)
          );
          setTimeout(() => {
            setShowAlert(false);
            setIsSuccess(false);
          }, 800);
        } else {
          throw new Error("Error while updating camera settings for this job");
        }
      })
      .catch(error => {
        warningToast("Something went wrong");
      });
  };

  const ShowAlertForSetting = (id, status) => {
    setNewSetting({ id, status });
    setShowAlert(true);
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Job Camera Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {!settings.length ? (
            <div
              className="row m-auto col-12 text-center"
              style={{ color: "#434d7d" }}
            >
              <span className="w-100 font-weight-bold">No Cameras Found!</span>
            </div>
          ) : (
            <></>
          )}
          {settings.map((setting, index) => (
            <>
              <div
                className="row m-auto col-12 text-center"
                style={{ background: "#434d7d", color: "white" }}
              >
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
                    <b>Camera Location</b>
                  </span>
                </div>
                <div className="col col-md-6">{setting?.camera_location}</div>
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
                  <a
                    style={{ wordBreak: "break-all" }}
                    href={setting?.rtsp_url}
                  >
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
                <div
                  style={{ textAlign: "center", marginLeft: "15px" }}
                  className={"mt-2"}
                >
                  <CustomInput
                    type="switch"
                    id={"setting-" + setting.id}
                    checked={setting?.status}
                    className="col col-md-6 custom-pointer"
                    onChange={() =>
                      ShowAlertForSetting(setting?.id, !setting?.status)
                    }
                  />
                </div>
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
                onConfirm={() => changeCameraSettingStatus()}
                onCancel={() => setShowAlert(false)}
                show={showAlert}
                focusCancelBtn
              />
            </>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
