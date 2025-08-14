import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {shallowEqual, useSelector} from "react-redux";
import {warningToast} from "../../../../../../../../utils/ToastMessage";
import {dateTimeFormatter} from "../../../../../../../../utils/DateTimeFormatter";

export function DeployedRTSPJobsViewDialog({id, show, onHide}) {


    const {entities} = useSelector(
        (state) => ({
            actionsLoading: state.deployedRTSPJobs1.actionsLoading,
            entities: state.deployedRTSPJobs1.entities
        }),
        shallowEqual
    );

    const [deployedRTSPJobsFetchedById, setDeployedRTSPJobsFetchedById] = useState({});
    useEffect(() => {
        if (id && entities) {
            const deployedRTSPJob = entities.filter(d => d.id === id * 1);
            if (deployedRTSPJob.length) {
                setDeployedRTSPJobsFetchedById(deployedRTSPJob[0]);
            } else
                warningToast('No deployedRTSP job found with that id');
        }
        //eslint-disable-next-line
    }, [id])

    return (
        <Modal
            size="lg"
            show={show}
            onHide={onHide}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">DeployedRTSP Job Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                {/**----------------------- DeployedRTSP Job Details --------------------------*/}

                <div className="row m-auto col-12 text-center" style={{background: "#147b82", color: 'white'}}>
                    <span className="w-100 font-weight-bold">DeployedRTSP Job Details</span>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>API Endpoint</b></span></div>
                    <div className="col col-md-6">{deployedRTSPJobsFetchedById?.api_endpoint}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Instance Id</b></span></div>
                    <div className="col col-md-6">{deployedRTSPJobsFetchedById?.instance_id}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Instance Status</b></span></div>
                    <div className="col col-md-6">{deployedRTSPJobsFetchedById?.instance_status}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Created Date</b></span></div>
                    <div className="col col-md-6">{dateTimeFormatter(deployedRTSPJobsFetchedById?.created_date)}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Updated Date</b></span></div>
                    <div className="col col-md-6">{dateTimeFormatter(deployedRTSPJobsFetchedById?.updated_date)}</div>
                </div>

                {/**----------------------- Deployment Job Details --------------------------*/}

                <div className="row m-auto col-12 text-center" style={{background: "#147b82", color: 'white'}}>
                    <span className="w-100 font-weight-bold">Deployment Job Details</span>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Image Size</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.image_size}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Confidence Threshold</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.confidence_threshold}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>IOU Threshold</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.iou_threshold}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Created Date</b></span></div>
                    <div
                        className="col col-md-6">{dateTimeFormatter(deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.created_date)}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Updated Date</b></span></div>
                    <div
                        className="col col-md-6">{dateTimeFormatter(deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.updated_date)}</div>
                </div>

                {/**----------------------- Deployment Type --------------------------*/}

                <div className="row m-auto col-12 text-center" style={{background: "#147b82", color: 'white'}}>
                    <span className="w-100 font-weight-bold">Deployment Type</span>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Deployment Type Name</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.deployment_type?.deployment_type_name}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Deployment Description</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.deployment_type?.deployment_type_description}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Created Date</b></span></div>
                    <div
                        className="col col-md-6">{dateTimeFormatter(deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.deployment_type?.created_date)}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Updated Date</b></span></div>
                    <div
                        className="col col-md-6">{dateTimeFormatter(deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.deployment_type?.updated_date)}</div>
                </div>

                {/**----------------------- Model Details --------------------------*/}

                <div className="row m-auto col-12 text-center" style={{background: "#147b82", color: 'white'}}>
                    <span className="w-100 font-weight-bold">Model Details</span>
                </div>

                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Model Name</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.model_name}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Model Description</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.model_description}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>CPU Infer Speed</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.model_cpu_infer_speed}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>GPU Infer Speed</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.model_gpu_infer_speed}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Model Depth</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.model_depth}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Model Version Id</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.model_version_id}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Model Accuracy</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.model_accuracy}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Model Size</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.model_size}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Model Framework Id</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.model_framework_id}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Framework Version Number</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.framework_version_number}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Created Date</b></span></div>
                    <div
                        className="col col-md-6">{dateTimeFormatter(deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.created_date)}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Updated Date</b></span></div>
                    <div
                        className="col col-md-6">{dateTimeFormatter(deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.model_details?.updated_date)}</div>
                </div>

                {/**----------------------- User Details --------------------------*/}

                <div className="row mt-2 mb-2 col-12 text-center" style={{background: "#147b82", color: 'white'}}>
                    <span className="w-100 font-weight-bold">User Details</span>
                </div>

                <div className="row">
                    <div className="col col-md-6"><span><b>User Email</b></span></div>
                    <div className="col col-md-6">
                        <a style={{wordBreak: 'break-all'}}
                           href={`mailto:${deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.user_email}`}>
                            {deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.user_email}
                        </a>
                    </div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Company Name</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_name}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Company Email</b></span></div>
                    <div className="col col-md-6">
                        <a style={{wordBreak: 'break-all'}}
                           href={`mailto:${deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_email}`}>
                            {deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_email}
                        </a>
                    </div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Company Description</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_description}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Company Website</b></span></div>
                    <div className="col col-md-6">
                        <a style={{wordBreak: 'break-all'}}
                           href={`${deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_website.startsWith('http://') ? '' : 'http://'}${deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_website}`}
                           target={'_blank'}
                        >
                            {deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_website}
                        </a>
                    </div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Company Address</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_address}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Company Pincode</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_pin_code}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Company Contact</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_contact}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Company POC</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_poc}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Company POC Contact</b></span></div>
                    <div
                        className="col col-md-6">{deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.company_poc_contact}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Created Date</b></span></div>
                    <div
                        className="col col-md-6">{dateTimeFormatter(deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.created_date)}</div>
                </div>
                <div className="row mt-2 mb-2">
                    <div className="col col-md-6"><span><b>Updated Date</b></span></div>
                    <div
                        className="col col-md-6">{dateTimeFormatter(deployedRTSPJobsFetchedById?.deployment_job_rtsp_details?.user_details?.company.updated_date)}</div>
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
