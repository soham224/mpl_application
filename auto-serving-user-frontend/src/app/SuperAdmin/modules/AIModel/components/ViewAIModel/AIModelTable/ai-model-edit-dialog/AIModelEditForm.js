import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { warningToast } from "../../../../../../../../utils/ToastMessage";

export function AIModelEditForm({
  aiModelDataById,
  deviceDetails,
  modelTypeDetails,
  frameworkDetails,
  onHide,
  updateAIModel
}) {
  const [formData, setFormData] = useState({
    modelName: "",
    modelDescription: "",
    modelCpuInferSpeed: "",
    modelGpuInferSpeed: "",
    modelVersionId: "",
    modelAccuracy: "",
    frameworkVersionNumber: "",
    modelTypeId: "",
    modelDeviceId: "",
    modelSize: "",
    modelDepth: "",
    modelFrameworkId: "",
    status: false,
    modelId: ""
  });

  const isValidate = () => {
    if (!formData.modelName) warningToast("Please Enter Model Name");
    else if (!formData.modelDescription)
      warningToast("Please Enter Model Description");
    else if (!formData.modelCpuInferSpeed)
      warningToast("Please Enter Model CPU Infer Speed");
    else if (!formData.modelGpuInferSpeed)
      warningToast("Please Enter Model GPU Infer Speed");
    else if (!formData.modelVersionId)
      warningToast("Please Enter Model Version Id");
    else if (!formData.modelAccuracy)
      warningToast("Please Enter Model Accuracy");
    else if (!formData.frameworkVersionNumber)
      warningToast("Please Enter Framework Version Number");
    else if (!formData.modelTypeId) warningToast("Please Select Model Type");
    else if (!formData.modelDeviceId) warningToast("Please Select Device");
    else if (!formData.modelSize) warningToast("Please Enter Model Size");
    else if (!formData.modelDepth) warningToast("Please Enter Model Depth");
    else if (!formData.modelFrameworkId)
      warningToast("Please Select Framework");
    else return true;

    return false;
  };

  useEffect(() => {
    const data = {
      modelName: aiModelDataById ? aiModelDataById.model_name : "",
      modelDescription: aiModelDataById
        ? aiModelDataById.model_description
        : "",
      modelCpuInferSpeed: aiModelDataById
        ? aiModelDataById.model_cpu_infer_speed
        : "",
      modelGpuInferSpeed: aiModelDataById
        ? aiModelDataById.model_gpu_infer_speed
        : "",
      modelVersionId: aiModelDataById ? aiModelDataById.model_version_id : "",
      modelAccuracy: aiModelDataById ? aiModelDataById.model_accuracy : "",
      frameworkVersionNumber: aiModelDataById
        ? aiModelDataById.framework_version_number
        : "",
      modelTypeId:
        modelTypeDetails &&
        modelTypeDetails.find(items =>
          aiModelDataById.model_type_id === items.value ? items : ""
        ),
      modelDeviceId:
        deviceDetails &&
        deviceDetails.find(items =>
          aiModelDataById.model_device_id === items.value ? items : ""
        ),
      modelSize: aiModelDataById ? aiModelDataById.model_size : "",
      modelDepth: aiModelDataById ? aiModelDataById.model_depth : "",
      modelFrameworkId:
        frameworkDetails &&
        frameworkDetails.find(items =>
          aiModelDataById.model_framework_id === items.value ? items : ""
        ),
      status: aiModelDataById ? aiModelDataById.status : "",
      modelId: aiModelDataById ? aiModelDataById.id : ""
    };
    setFormData(data);
  }, [aiModelDataById, deviceDetails, modelTypeDetails, frameworkDetails]);

  const handleChange = e => {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  };

  const handleSelect = (key, value) => {
    let data = { ...formData };
    data[key] = value;
    setFormData(data);
  };

  const handleSubmit = formData => {
    if (isValidate()) updateAIModel(formData);
  };

  return (
    <>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} controlId="modelName">
            <Form.Label column sm={4}>
              {" "}
              Model Name{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Name"
                name="modelName"
                value={formData.modelName}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="modelDescription">
            <Form.Label column sm={4}>
              {" "}
              Model Description{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Model Description"
                name="modelDescription"
                value={formData.modelDescription}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="modelGpuInferSpeed">
            <Form.Label column sm={4}>
              {" "}
              Model GPU Infer Speed{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model GPU Infer Speed"
                name="modelGpuInferSpeed"
                value={formData.modelGpuInferSpeed}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="modelCpuInferSpeed">
            <Form.Label column sm={4}>
              {" "}
              Model CPU Infer Speed{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model CPU Infer Speed"
                name="modelCpuInferSpeed"
                value={formData.modelCpuInferSpeed}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="modelVersionId">
            <Form.Label column sm={4}>
              {" "}
              Model Version Id{" "}
            </Form.Label>
            <Col sm={8}>
              {" "}
              <Form.Control
                type="text"
                placeholder="Model Version Id"
                name="modelVersionId"
                value={formData.modelVersionId}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              {" "}
              Model Accuracy{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Accuracy"
                name="modelAccuracy"
                value={formData.modelAccuracy}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="modelSize">
            <Form.Label column sm={4}>
              {" "}
              Model Size{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Size"
                value={formData.modelSize}
                name="modelSize"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="modelDepth">
            <Form.Label column sm={4}>
              {" "}
              Model Depth{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Depth"
                name="modelDepth"
                value={formData.modelDepth}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="frameworkVersionNumber">
            <Form.Label column sm={4}>
              {" "}
              Framework Version Number{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Framework Version Number"
                name="frameworkVersionNumber"
                value={formData.frameworkVersionNumber}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              {" "}
              Model Type{" "}
            </Form.Label>
            <Col sm={8}>
              <Select
                className="select-react-dropdown"
                options={modelTypeDetails}
                onChange={value => handleSelect("modelTypeId", value)}
                placeHolder={"Select model"}
                value={formData.modelTypeId}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              {" "}
              Model Device{" "}
            </Form.Label>
            <Col sm={8}>
              <Select
                className="select-react-dropdown"
                options={deviceDetails}
                onChange={value => handleSelect("modelDeviceId", value)}
                placeHolder={"Select model"}
                value={formData.modelDeviceId}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              {" "}
              Framework{" "}
            </Form.Label>
            <Col sm={8}>
              <Select
                className="select-react-dropdown"
                options={frameworkDetails}
                onChange={value => handleSelect("modelFrameworkId", value)}
                placeHolder={"Select model"}
                value={formData.modelFrameworkId}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Cancel
        </Button>
        <> </>
        <Button
          type="submit"
          onClick={() => handleSubmit(formData, formData.modelId)}
          className="btn btn-primary btn-elevate"
        >
          Save
        </Button>
      </Modal.Footer>
    </>
  );
}
