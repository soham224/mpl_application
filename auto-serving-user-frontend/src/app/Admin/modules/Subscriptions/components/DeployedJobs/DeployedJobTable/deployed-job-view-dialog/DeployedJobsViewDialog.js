/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { warningToast } from "../../../../../../../../utils/ToastMessage";
import * as moment from "moment";

export function DeployedJobsViewDialog({ id, show, onHide }) {
  const { entities } = useSelector(
    (state) => ({
      entities: state.deployedJobs.entities,
    }),
    shallowEqual
  );

  const [deployedJobsFetchedById, setDeployedJobsFetchedById] = useState({});
  useEffect(() => {
    if (id && entities) {
      const deployedJob = entities.filter((d) => d.id === id * 1);
      if (deployedJob.length) {
        setDeployedJobsFetchedById(deployedJob[0]);
      } else warningToast("No deployed job found with that id");
    }
  }, [id, entities]);

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Deployed Job Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row col-12 view-title">
          <span
            className="w-100 font-weight-bold"
            style={{
              background: "#147b82",
              color: "white",
              margin: "20px auto",
            }}
          >
            Deployed Job Details
          </span>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>API Endpoint</b>
            </span>
          </div>
          <div className="col col-md-6">
            <a
              style={{ wordBreak: "break-all" }}
              href={deployedJobsFetchedById?.api_endpoint}
              target={"_blank"}
            >
              {deployedJobsFetchedById?.api_endpoint}
            </a>
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Instance Id</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deployedJobsFetchedById?.instance_id}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Instance Status</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deployedJobsFetchedById?.instance_status}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Created Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {moment
              .utc(deployedJobsFetchedById?.created_date)
              .local()
              .format("MMMM DD YYYY, h:mm:ss a")}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Updated Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {moment
              .utc(deployedJobsFetchedById?.updated_date)
              .local()
              .format("MMMM DD YYYY, h:mm:ss a")}
          </div>
        </div>

        <div className="row col-12 view-title text-center">
          <span
            className="w-100 font-weight-bold"
            style={{
              background: "#147b82",
              color: "white",
              margin: "20px auto",
            }}
          >
            Deployment Job Details
          </span>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Image Size</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deployedJobsFetchedById?.deployment_job_details?.image_size}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Confidence Threshold</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deployedJobsFetchedById?.deployment_job_details
                ?.confidence_threshold
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>IOU Threshold</b>
            </span>
          </div>
          <div className="col col-md-6">
            {deployedJobsFetchedById?.deployment_job_details?.iou_threshold}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Created Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {moment
              .utc(
                deployedJobsFetchedById?.deployment_job_details?.created_date
              )
              .local()
              .format("MMMM DD YYYY, h:mm:ss a")}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Updated Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {moment
              .utc(
                deployedJobsFetchedById?.deployment_job_details?.updated_date
              )
              .local()
              .format("MMMM DD YYYY, h:mm:ss a")}
          </div>
        </div>

        <div className="row col-12 view-title text-center">
          <span
            className="w-100 font-weight-bold"
            style={{
              background: "#147b82",
              color: "white",
              margin: "20px auto",
            }}
          >
            Deployment Type
          </span>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Deployment Type Name</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deployedJobsFetchedById?.deployment_job_details?.deployment_type
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
              deployedJobsFetchedById?.deployment_job_details?.deployment_type
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
            {moment
              .utc(
                deployedJobsFetchedById?.deployment_job_details?.deployment_type
                  ?.created_date
              )
              .local()
              .format("MMMM DD YYYY, h:mm:ss a")}
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Updated Date</b>
            </span>
          </div>
          <div className="col col-md-6">
            {moment
              .utc(
                deployedJobsFetchedById?.deployment_job_details?.deployment_type
                  ?.updated_date
              )
              .local()
              .format("MMMM DD YYYY, h:mm:ss a")}
          </div>
        </div>

        <div className="row col-12 view-title text-center">
          <span
            className="w-100 font-weight-bold"
            style={{
              background: "#147b82",
              color: "white",
              margin: "20px auto",
            }}
          >
            Model Details
          </span>
        </div>

        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Name</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deployedJobsFetchedById?.deployment_job_details?.model_details
                ?.model_name
            }
          </div>
        </div>
        <div className="row mt-2 mb-2">
          <div className="col col-md-6">
            <span>
              <b>Model Description</b>
            </span>
          </div>
          <div className="col col-md-6">
            {
              deployedJobsFetchedById?.deployment_job_details?.model_details
                ?.model_description
            }
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
