import React from "react";
import {Button, Modal} from "react-bootstrap";

export function AIModelDetailsForm({
  aiModelViewDetails,
  deviceViewDetails,
  modelTypeViewDetails,
  frameworkViewDetails,
  actionsLoading,
  onHide,
}) {

  let modelS3Data = aiModelViewDetails?.model_s3_data;
  let modelTrainingData = aiModelViewDetails?.model_training_settings;

  return (
      <>
        <Modal.Body>
          {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner-border text-info text-center"/>
              </div>
          )}
          <div className="row justify-content-md-center text-white" style={{backgroundColor: "#434d7d"}}>AI Model</div>
        {aiModelViewDetails ?
          <div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>AI Model Description</b></span></div>
              <div className="col col-md-6">{aiModelViewDetails?.model_description}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Created Date</b></span></div>
              <div className="col col-md-6">{aiModelViewDetails?.created_date}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Updated Date</b></span></div>
              <div className="col col-md-6">{aiModelViewDetails?.updated_date}</div>
            </div>
          </div>
          : ''
        }

        <div className="row justify-content-md-center text-white mt-3" style={{ backgroundColor: "#434d7d" }}>Device</div>
        {deviceViewDetails ?
          <div className="mt-3">
            <div className="row">
              <div className="col col-md-6"><span><b>Device Name </b></span></div>
              <div className="col col-md-6">{deviceViewDetails.device_name}</div>
            </div>
            <div className=" row mt-3">
              <div className="col col-md-6"><span><b>Device Description</b></span></div>
              <div className="col col-md-6">{deviceViewDetails.device_description}</div>
            </div>
            <div className=" row mt-3">
              <div className="col col-md-6"><span><b>Created Date</b></span></div>
              <div className="col col-md-6">{deviceViewDetails.created_date}</div>
            </div>
            <div className=" row mt-3">
              <div className="col col-md-6"><span><b>Updated Date</b></span></div>
              <div className="col col-md-6">{deviceViewDetails.updated_date}</div>
            </div>
          </div>
          : ''
        }
        <div className="row justify-content-md-center text-white mt-3" style={{ backgroundColor: "#434d7d" }}>Model Type</div>
        {modelTypeViewDetails ?
          <div className="mt-3">
            <div className="row">
              <div className="col col-md-6"><span><b>Model Type Name</b></span></div>
              <div className="col col-md-6">{modelTypeViewDetails.model_type_name}</div>
            </div>
            <div className="mt-3 row">
              <div className="col col-md-6"><span><b>Model Type Description</b></span></div>
              <div className="col col-md-6">{modelTypeViewDetails.model_type_description}</div>
            </div>
            <div className=" row mt-3">
              <div className="col col-md-6"><span><b>Created Date</b></span></div>
              <div className="col col-md-6">{modelTypeViewDetails.created_date}</div>
            </div>
            <div className=" row mt-3">
              <div className="col col-md-6"><span><b>Updated Date</b></span></div>
              <div className="col col-md-6">{modelTypeViewDetails.updated_date}</div>
            </div>
          </div>
          : ''
        }
        <div className="row justify-content-md-center  text-white mt-3" style={{ backgroundColor: "#434d7d" }}>Framework</div>
        {frameworkViewDetails ?
          <div className="mt-3">
            <div className="row">
              <div className="col col-md-6"><span><b>FrameWork Name</b></span></div>
              <div className="col col-md-6">{frameworkViewDetails.framework_name}</div>
            </div>
            <div className="mt-3 row">
              <div className="col col-md-6"><span><b>FrameWork Version Number</b></span></div>
              <div className="col col-md-6">{frameworkViewDetails.framework_version_number}</div>
            </div>
            <div className=" row mt-3">
              <div className="col col-md-6"><span><b>Created Date</b></span></div>
              <div className="col col-md-6">{frameworkViewDetails.created_date}</div>
            </div>
            <div className=" row mt-3">
              <div className="col col-md-6"><span><b>Updated Date</b></span></div>
              <div className="col col-md-6">{frameworkViewDetails.updated_date}</div>
            </div>
          </div>
          : ''
        }



        <div className="row justify-content-md-center text-white mt-3" style={{ backgroundColor: "#434d7d" }}>Model S3 Data</div>
        {modelS3Data ?
          <div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Model S3 Key</b></span></div>
              <div className="col col-md-6">{modelS3Data.model_s3_key}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Model S3 Name</b></span></div>
              <div className="col col-md-6">{modelS3Data.model_s3_name}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Model S3 URL</b></span></div>
              <div className="col col-md-6">{modelS3Data.model_s3_url}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Model Version</b></span></div>
              <div className="col col-md-6">{modelS3Data.model_version}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Created Date</b></span></div>
              <div className="col col-md-6">{modelS3Data.created_date}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Updated Date</b></span></div>
              <div className="col col-md-6">{modelS3Data.updated_date}</div>
            </div>
          </div>
          : ''
        }

        <div className="row justify-content-md-center text-white mt-3" style={{ backgroundColor: "#434d7d" }}>Model Training Settings</div>
        {modelTrainingData ?
          <div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Batch Size</b></span></div>
              <div className="col col-md-6">{modelTrainingData.batch_size}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Image Size</b></span></div>
              <div className="col col-md-6">{modelTrainingData.image_size}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Model Epochs</b></span></div>
              <div className="col col-md-6">{modelTrainingData.model_epochs}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Model Labels List</b></span></div>
              <div className="col col-md-6">{modelTrainingData.model_labels_list}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Model Training Batch Size</b></span></div>
              <div className="col col-md-6">{modelTrainingData.model_training_batch_size}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Created Date</b></span></div>
              <div className="col col-md-6">{modelTrainingData.created_date}</div>
            </div>
            <div className="row mt-3">
              <div className="col col-md-6"><span><b>Updated Date</b></span></div>
              <div className="col col-md-6">{modelTrainingData.updated_date}</div>
            </div>
          </div>
          : ''
        }

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

    </>
  );
}
