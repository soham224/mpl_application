import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../../../../../_metronic/_partials/controls";
//import { UsersFilter } from "./users-filter/UsersFilter";
//import { UsersTable } from "./users-table/UsersTable";
// import { CustomersGrouping } from "./customers-grouping/CustomersGrouping";
import { useAIModelUIContext } from "./AiModelDetailsUIContext";
import { Col, Form, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as action from "../../../../AIModel/_redux/AiModelAction";
import { AiModelSlice } from "../../../../AIModel/_redux/AiModelSlice";
const { actions } = AiModelSlice;
export function AiModelDetailsCard() {
  const {
    deviceDetails,
    modelTypeDetails,
    frameworkDetails,
    aiModelFormData,
    actionsLoading
  } = useSelector(
    state => ({
      deviceDetails: state.aiModel.deviceDetails,
      modelTypeDetails: state.aiModel.modelTypeDetails,
      frameworkDetails: state.aiModel.frameworkDetails,
      aiModelFormData: state.aiModel.aiModelFormData,
      actionsLoading: state.aiModel.actionsLoading
    }),
    shallowEqual
  );

  const [formData, setFormData] = useState({
    modelName: aiModelFormData ? aiModelFormData.modelName : "",
    modelDescription: aiModelFormData ? aiModelFormData.modelDescription : "",
    modelCpuInferSpeed: aiModelFormData
      ? aiModelFormData.modelCpuInferSpeed
      : "",
    modelGpuInferSpeed: aiModelFormData
      ? aiModelFormData.modelGpuInferSpeed
      : "",
    modelVersionId: aiModelFormData ? aiModelFormData.modelVersionId : "",
    modelAccuracy: aiModelFormData ? aiModelFormData.modelAccuracy : "",
    frameworkVersionNumber: aiModelFormData
      ? aiModelFormData.frameworkVersionNumber
      : "",
    modelTypeId: aiModelFormData ? aiModelFormData.modelTypeId : "",
    modelDeviceId: aiModelFormData ? aiModelFormData.modelDeviceId : "",
    modelSize: aiModelFormData ? aiModelFormData.modelSize : "",
    modelDepth: aiModelFormData ? aiModelFormData.modelDepth : "",
    modelFrameworkId: aiModelFormData ? aiModelFormData.modelFrameworkId : "",
    status: false,
    modelId: aiModelFormData ? aiModelFormData.modelId : ""
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(action.fetchDevice());
    dispatch(action.fetchModelType());
    dispatch(action.fetchFramework());
  }, []);

  const handleChange = (key, event) => {
    let value = event.target.value;
    let data = { ...formData };
    data[key] = value;
    setFormData(data);
    dispatch(actions.setAIModelFormData(data));
  };
  const handleSelect = (key, value) => {
    let data = { ...formData };
    data[key] = value;
    setFormData(data);

    dispatch(actions.setAIModelFormData(data));
  };

  return (
    <Card>
      {actionsLoading && (
        <div className="overlay-layer bg-transparent">
          <div className="spinner spinner-lg spinner-success" />
        </div>
      )}
      <CardHeader title="Add AI Model Details">
        {/* <CardHeaderToolbar>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={usersUIProps.newUserButtonClick}
                    >
                        Add AI Model
                    </button>
                </CardHeaderToolbar>*/}
      </CardHeader>
      <CardBody>
        {/*<UsersFilter />*/}
        {/*/!*{customersUIProps.ids.length > 0 && <CustomersGrouping />}*!/*/}
        {/*<UsersTable />*/}

        <Form>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Name
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Name"
                defaultValue={formData.modelName}
                onChange={event => handleChange("modelName", event)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Description
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Model Description"
                defaultValue={formData.modelDescription}
                onChange={event => handleChange("modelDescription", event)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model GPU Infer Speed
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model GPU Infer Speed"
                defaultValue={formData.modelGpuInferSpeed}
                onChange={event => handleChange("modelGpuInferSpeed", event)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model CPU Infer Speed
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model CPU Infer Speed"
                defaultValue={formData.modelCpuInferSpeed}
                onChange={event => handleChange("modelCpuInferSpeed", event)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Version Id
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Version Id"
                defaultValue={formData.modelVersionId}
                onChange={event => handleChange("modelVersionId", event)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Accuracy
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Accuracy"
                defaultValue={formData.modelAccuracy}
                onChange={event => handleChange("modelAccuracy", event)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Size
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Size"
                defaultValue={formData.modelSize}
                onChange={event => handleChange("modelSize", event)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Depth
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Depth"
                defaultValue={formData.modelDepth}
                onChange={event => handleChange("modelDepth", event)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Framework Version Number
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Framework Version Number"
                defaultValue={formData.frameworkVersionNumber}
                onChange={event =>
                  handleChange("frameworkVersionNumber", event)
                }
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Type
            </Form.Label>
            <Col sm={8}>
              {/*<DropdownButton id="dropdown-basic-button" title="Model" drop={"right"}>
                                <DropdownItem>Action 1</DropdownItem>
                                <DropdownItem >Action 2</DropdownItem>
                                <DropdownItem>Action 3</DropdownItem>
                                <DropdownItem href="#/action-1">Action</DropdownItem>
                            </DropdownButton>*/}
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
              Model Device
            </Form.Label>
            <Col sm={8}>
              {/*<DropdownButton id="dropdown-basic-button" title="Model" drop={"right"}>
                                <DropdownItem>Action 1</DropdownItem>
                                <DropdownItem >Action 2</DropdownItem>
                                <DropdownItem>Action 3</DropdownItem>
                                <DropdownItem href="#/action-1">Action</DropdownItem>
                            </DropdownButton>*/}
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
              Framework
            </Form.Label>
            <Col sm={8}>
              {/*<DropdownButton id="dropdown-basic-button" title="Model" drop={"right"}>
                                <DropdownItem>Action 1</DropdownItem>
                                <DropdownItem >Action 2</DropdownItem>
                                <DropdownItem>Action 3</DropdownItem>
                                <DropdownItem href="#/action-1">Action</DropdownItem>
                            </DropdownButton>*/}
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
      </CardBody>
    </Card>
  );
}
