import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchDeploymentRTSPJobById } from "../../../../_redux/DeploymentRTSPJobs/DeploymentRTSPJobsAction";
import { dateTimeFormatter } from "../../../../../../../../utils/DateTimeFormatter";

export function DeploymentRTSPJobsViewDialog({ id, show, onHide }) {
  const dispatch = useDispatch();
  const { deploymentRTSPJobsFetchedById } = useSelector(
    state => ({
      deploymentRTSPJobsFetchedById:
        state.deploymentRTSPJobs1.deploymentRTSPJobsFetchedById
    }),
    shallowEqual
  );

  useEffect(() => {
    if (id) dispatch(fetchDeploymentRTSPJobById(id));
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
          Deployment RTSP job Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/*********************
                 Image Details
                 ***********************/}
        <div
          className="row m-auto col-12 text-center"
          style={{ background: "#147b82", color: "white" }}
        >
          <span className="w-100 font-weight-bold">Image Details</span>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Image Size</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.image_size}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Confidence Threshold</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.confidence_threshold}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>IOU Threshold</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.iou_threshold}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Created Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {dateTimeFormatter(deploymentRTSPJobsFetchedById?.created_date)}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Updated Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {dateTimeFormatter(deploymentRTSPJobsFetchedById?.updated_date)}
          </div>
        </div>

        {/*********************
                 Deployment Details
                 ***********************/}
        <div
          className="row m-auto col-12 text-center"
          style={{ background: "#147b82", color: "white" }}
        >
          <span className="w-100 font-weight-bold">Deployment Type</span>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Deployment Type Name</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deploymentRTSPJobsFetchedById?.deployment_type
                ?.deployment_type_name
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Deployment Description</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deploymentRTSPJobsFetchedById?.deployment_type
                ?.deployment_type_description
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Created Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {dateTimeFormatter(
              deploymentRTSPJobsFetchedById?.deployment_type?.created_date
            )}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Updated Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {dateTimeFormatter(
              deploymentRTSPJobsFetchedById?.deployment_type?.updated_date
            )}
          </div>
        </div>

        {/*********************
                 Camera Details
                 ***********************/}

        {!deploymentRTSPJobsFetchedById?.camera_settings?.length ? (
          <></>
        ) : (
          deploymentRTSPJobsFetchedById.camera_settings.map(
            (setting, index) => (
              <>
                <div
                  className="row m-auto col-12 text-center"
                  style={{ background: "#147b82", color: "white" }}
                >
                  <span className="w-100 font-weight-bold">
                    Camera{" "}
                    {deploymentRTSPJobsFetchedById?.camera_settings?.length ===
                    1
                      ? ""
                      : index + 1}{" "}
                    Details
                  </span>
                </div>
                <div className="row mt-2 mb-2">
                  <div className="col col-md-6">
                    <span>
                      <b>Camera Name</b>
                    </span>
                  </div>
                  <div className="col col-md-6">{setting.camera_name}</div>
                </div>
                <div className="row mt-2 mb-2">
                  <div className="col col-md-6">
                    <span>
                      <b>Camera Ip</b>
                    </span>
                  </div>
                  <div className="col col-md-6">{setting.camera_ip}</div>
                </div>
                <div className="row mt-2 mb-2">
                  <div className="col col-md-6">
                    <span>
                      <b>Camera Location</b>
                    </span>
                  </div>
                  <div className="col col-md-6">{setting.location_id}</div>
                </div>
                <div className="row mt-2 mb-2">
                  <div className="col col-md-6">
                    <span>
                      <b>Camera Resolution</b>
                    </span>
                  </div>
                  <div className="col col-md-6">
                    {setting.camera_resolution}
                  </div>
                </div>
                <div className="row mt-2 mb-2">
                  <div className="col col-md-6">
                    <span>
                      <b>Process FPS</b>
                    </span>
                  </div>
                  <div className="col col-md-6">
                    {setting.process_fps ? "Yes" : "No"}
                  </div>
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
                      href={setting.rtsp_url}
                    >
                      {setting.rtsp_url}
                    </a>
                  </div>
                </div>
                <div className="row mt-2 mb-2">
                  <div className="col col-md-6">
                    <span>
                      <b>Active</b>
                    </span>
                  </div>
                  <div className="col col-md-6">
                    {setting.is_active ? "Yes" : "No"}
                  </div>
                </div>
                <div className="row mt-2 mb-2">
                  <div className="col col-md-6">
                    <span>
                      <b>Processing</b>
                    </span>
                  </div>
                  <div className="col col-md-6">
                    {setting.is_processing ? "Yes" : "No"}
                  </div>
                </div>
                <div className="row mt-2 mb-2">
                  <div className="col col-md-6">
                    <span>
                      <b>TCP</b>
                    </span>
                  </div>
                  <div className="col col-md-6">
                    {setting.is_tcp ? "Yes" : "No"}
                  </div>
                </div>
                {/*<div className="row mt-2 mb-2">
                                    <div className="col col-md-6"><span><b>Created Date</b></span></div>
                                    <div className="col col-md-6">{dateTimeFormatter(setting?.created_date)}</div>
                                </div>
                                <div className="row mt-2 mb-2">
                                    <div className="col col-md-6"><span><b>Updated Date</b></span></div>
                                    <div className="col col-md-6">{dateTimeFormatter(setting?.updated_date)}</div>
                                </div>*/}
              </>
            )
          )
        )}

        {/*********************
                 Model Details
                 ***********************/}
        <div
          className="row m-auto col-12 text-center"
          style={{ background: "#147b82", color: "white" }}
        >
          <span className="w-100 font-weight-bold">Model Details</span>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Name</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.model_details?.model_name}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Description</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.model_details?.model_description}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>CPU Infer Speed</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deploymentRTSPJobsFetchedById?.model_details
                ?.model_cpu_infer_speed
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>GPU Infer Speed</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deploymentRTSPJobsFetchedById?.model_details
                ?.model_gpu_infer_speed
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Depth</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.model_details?.model_depth}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Version Id</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.model_details?.model_version_id}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Accuracy</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.model_details?.model_accuracy}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Size</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.model_details?.model_size}
          </div>
        </div>

        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Framework Id</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.model_details?.model_framework_id}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Framework Version Number</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deploymentRTSPJobsFetchedById?.model_details
                ?.framework_version_number
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Created Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {dateTimeFormatter(
              deploymentRTSPJobsFetchedById?.model_details?.created_date
            )}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Updated Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {dateTimeFormatter(
              deploymentRTSPJobsFetchedById?.model_details?.updated_date
            )}
          </div>
        </div>

        {/*********************
                 User Details
                 ***********************/}
        <div
          className="row mt-2 mb-2 col-12 text-center"
          style={{ background: "#147b82", color: "white" }}
        >
          <span className="w-100 font-weight-bold">User Details</span>
        </div>
        <div className="row">
          <div className="col col-md-6">
            <span>
              <b>User Email</b>
            </span>
          </div>
          <div className="col col-md-6">
            <a
              style={{ wordBreak: "break-all" }}
              href={`mailto:${deploymentRTSPJobsFetchedById?.user_details?.user_email}`}
            >
              {deploymentRTSPJobsFetchedById?.user_details?.user_email}
            </a>
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company Name</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.user_details?.company.company_name}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company Email</b>
            </span>
          </div>
          <div className="col col-md-6">
            <a
              style={{ wordBreak: "break-all" }}
              href={`mailto:${deploymentRTSPJobsFetchedById?.user_details?.company.company_email}`}
            >
              {
                deploymentRTSPJobsFetchedById?.user_details?.company
                  .company_email
              }
            </a>
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company Description</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deploymentRTSPJobsFetchedById?.user_details?.company
                .company_description
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company Website</b>
            </span>
          </div>
          <div className="col col-md-6">
            <a
              style={{ wordBreak: "break-all" }}
              href={`${
                deploymentRTSPJobsFetchedById?.user_details?.company.company_website.startsWith(
                  "http://"
                )
                  ? ""
                  : "http://"
              }${
                deploymentRTSPJobsFetchedById?.user_details?.company
                  .company_website
              }`}
              target={"_blank"}
            >
              {
                deploymentRTSPJobsFetchedById?.user_details?.company
                  .company_website
              }
            </a>
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company Address</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deploymentRTSPJobsFetchedById?.user_details?.company
                .company_address
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company Pincode</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deploymentRTSPJobsFetchedById?.user_details?.company
                .company_pin_code
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company Contact</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deploymentRTSPJobsFetchedById?.user_details?.company
                .company_contact
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company POC</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentRTSPJobsFetchedById?.user_details?.company.company_poc}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company POC Contact</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deploymentRTSPJobsFetchedById?.user_details?.company
                .company_poc_contact
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Created Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {dateTimeFormatter(
              deploymentRTSPJobsFetchedById?.user_details?.company.created_date
            )}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Updated Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {dateTimeFormatter(
              deploymentRTSPJobsFetchedById?.user_details?.company.updated_date
            )}
          </div>
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
    </Modal>
  );
}
