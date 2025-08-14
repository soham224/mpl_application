import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchInferJobById } from "../../_redux/InferJobsAction";
import { dateTimeFormatter } from "../../../../../../utils/DateTimeFormatter";

export function InferJobsViewDialog({ id, show, onHide }) {
  const dispatch = useDispatch();
  const { actionsLoading, inferJobsFetchedById } = useSelector(
    (state) => ({
      actionsLoading: state.inferJobs.actionsLoading,
      inferJobsFetchedById: state.inferJobs.inferJobsFetchedById,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (id) dispatch(fetchInferJobById(id));
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
          Infer Job Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {actionsLoading && (
          <div className="overlay-layer bg-transparent">
            <div className="spinner spinner-lg spinner-success" />
          </div>
        )}
        {/*******************
                 Image Details
                 ********************/}
        <>
          <div className="row col-12 view-title text-center">
            <span
              className="w-100 font-weight-bold"
              style={{
                background: "#147b82",
                color: "white",
                margin: "20px auto",
              }}
            >
              Image Details
            </span>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Image Size</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.image_size}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Confidence Threshold</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.confidence_threshold}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>IOU Threshold</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.iou_threshold}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Created Date</b>
              </span>
            </div>
            <div className="col col-md-6">
              {dateTimeFormatter(inferJobsFetchedById?.created_date)}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Updated Date</b>
              </span>
            </div>
            <div className="col col-md-6">
              {dateTimeFormatter(inferJobsFetchedById?.updated_date)}
            </div>
          </div>
        </>

        {/*******************
                 Model Details
                 ********************/}
        <>
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
              {inferJobsFetchedById?.model_details?.model_name}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Model Description</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.model_details?.model_description}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>CPU Infer Speed</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.model_details?.model_cpu_infer_speed}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>GPU Infer Speed</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.model_details?.model_gpu_infer_speed}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Model Depth</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.model_details?.model_depth}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Model Version Id</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.model_details?.model_version_id}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Model Accuracy</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.model_details?.model_accuracy}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Model Size</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.model_details?.model_size}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Model Framework Id</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.model_details?.model_framework_id}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Framework Version Number</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.model_details?.framework_version_number}
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
                inferJobsFetchedById?.model_details?.created_date
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
                inferJobsFetchedById?.model_details?.updated_date
              )}
            </div>
          </div>
        </>
        {/*******************
                 User Details
                 ********************/}
        <>
          <div className="row col-12 view-title text-center">
            <span
              className="w-100 font-weight-bold"
              style={{
                background: "#147b82",
                color: "white",
                margin: "20px auto",
              }}
            >
              User Details
            </span>
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
                href={`mailto:${inferJobsFetchedById?.user_details?.user_email}`}
              >
                {inferJobsFetchedById?.user_details?.user_email}
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
              {inferJobsFetchedById?.user_details?.company.company_name}
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
                href={`mailto:${inferJobsFetchedById?.user_details?.company.company_email}`}
              >
                {inferJobsFetchedById?.user_details?.company.company_email}
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
              {inferJobsFetchedById?.user_details?.company.company_description}
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
                  inferJobsFetchedById?.user_details?.company.company_website.startsWith(
                    "http://"
                  )
                    ? ""
                    : "http://"
                }${
                  inferJobsFetchedById?.user_details?.company.company_website
                }`}
                target={"_blank"}
              >
                {inferJobsFetchedById?.user_details?.company.company_website}
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
              {inferJobsFetchedById?.user_details?.company.company_address}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Company Pincode</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.user_details?.company.company_pin_code}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Company Contact</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.user_details?.company.company_contact}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Company POC</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.user_details?.company.company_poc}
            </div>
          </div>
          <div className="row mt-2 mb-2">
            <div className="col col-md-6">
              <span>
                <b>Company POC Contact</b>
              </span>
            </div>
            <div className="col col-md-6">
              {inferJobsFetchedById?.user_details?.company.company_poc_contact}
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
                inferJobsFetchedById?.user_details?.company.created_date
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
                inferJobsFetchedById?.user_details?.company.updated_date
              )}
            </div>
          </div>
        </>
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
