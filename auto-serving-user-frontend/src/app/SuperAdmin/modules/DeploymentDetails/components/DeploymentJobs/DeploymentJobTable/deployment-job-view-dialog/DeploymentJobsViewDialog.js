import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchDeploymentJobById } from "../../../../_redux/DeploymentJobs/DeploymentJobsAction";
import { dateTimeFormatter } from "../../../../../../../../utils/DateTimeFormatter";

export function DeploymentJobsViewDialog({ id, show, onHide }) {
  const dispatch = useDispatch();
  const { deploymentJobsFetchedById } = useSelector(
    state => ({
      deploymentJobsFetchedById: state.deploymentJobs.deploymentJobsFetchedById
    }),
    shallowEqual
  );

  useEffect(() => {
    if (id) dispatch(fetchDeploymentJobById(id));
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
          Deployment Job Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/**----------------------- Deployment Job Details --------------------------*/}

        <div
          className="row m-auto col-12 text-center"
          style={{ background: "#434d7d", color: "white" }}
        >
          <span className="w-100 font-weight-bold">Deployment Job Details</span>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Image Size</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.image_size}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Confidence Threshold</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.confidence_threshold}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>IOU Threshold</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.iou_threshold}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Created Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {dateTimeFormatter(deploymentJobsFetchedById?.created_date)}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Updated Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {dateTimeFormatter(deploymentJobsFetchedById?.updated_date)}
          </div>
        </div>

        {/**----------------------- Deployment Type --------------------------*/}

        <div
          className="row m-auto col-12 text-center"
          style={{ background: "#434d7d", color: "white" }}
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
            {deploymentJobsFetchedById?.deployment_type?.deployment_type_name}
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
              deploymentJobsFetchedById?.deployment_type
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
              deploymentJobsFetchedById?.deployment_type?.created_date
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
              deploymentJobsFetchedById?.deployment_type?.updated_date
            )}
          </div>
        </div>

        {/**----------------------- Model Details --------------------------*/}

        <div
          className="row m-auto col-12 text-center"
          style={{ background: "#434d7d", color: "white" }}
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
            {deploymentJobsFetchedById?.model_details?.model_name}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Description</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.model_details?.model_description}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>CPU Infer Speed</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.model_details?.model_cpu_infer_speed}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>GPU Infer Speed</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.model_details?.model_gpu_infer_speed}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Depth</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.model_details?.model_depth}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Version Id</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.model_details?.model_version_id}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Accuracy</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.model_details?.model_accuracy}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Size</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.model_details?.model_size}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Framework Id</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.model_details?.model_framework_id}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Framework Version Number</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.model_details?.framework_version_number}
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
              deploymentJobsFetchedById?.model_details?.created_date
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
              deploymentJobsFetchedById?.model_details?.updated_date
            )}
          </div>
        </div>

        {/**----------------------- User Details --------------------------*/}

        <div
          className="row mt-2 mb-2 col-12 text-center"
          style={{ background: "#434d7d", color: "white" }}
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
              href={`mailto:${deploymentJobsFetchedById?.user_details?.user_email}`}
            >
              {deploymentJobsFetchedById?.user_details?.user_email}
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
            {deploymentJobsFetchedById?.user_details?.company_name}
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
              href={`mailto:${deploymentJobsFetchedById?.user_details?.company_email}`}
            >
              {deploymentJobsFetchedById?.user_details?.company_email}
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
            {deploymentJobsFetchedById?.user_details?.company_description}
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
                deploymentJobsFetchedById?.user_details?.company_website.startsWith(
                  "http://"
                )
                  ? ""
                  : "http://"
              }${deploymentJobsFetchedById?.user_details?.company_website}`}
              target={"_blank"}
            >
              {deploymentJobsFetchedById?.user_details?.company_website}
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
            {deploymentJobsFetchedById?.user_details?.company_address}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company Pincode</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.user_details?.company_pin_code}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company Contact</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.user_details?.company_contact}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company POC</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.user_details?.company_poc}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Company POC Contact</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deploymentJobsFetchedById?.user_details?.company_poc_contact}
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
              deploymentJobsFetchedById?.user_details?.company_created_date
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
              deploymentJobsFetchedById?.user_details?.company_updated_date
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
