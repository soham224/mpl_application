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
import { useUsersUIContext } from "./S3DataHandlerUIContext";
import { Col, DropdownButton, Form, Modal, Row } from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import Select from "react-select";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as action from "../../../../AIModel/_redux/AiModelAction";
import { S3DataHandlerSlice } from "../../../_redux/S3DataHandler/S3DataHandlerSlice";
const { actions } = S3DataHandlerSlice;

export function S3DataHandlerCard() {
  const {
    aiModelDetails,
    s3DataHandlerFormData,
    actionsLoading,
    aiModelCreatedData
  } = useSelector(
    state => ({
      aiModelDetails: state.aiModel.aiModelDetails,
      s3DataHandlerFormData: state.s3DataHandler.s3DataHandlerFormData,
      actionsLoading: state.s3DataHandler.actionsLoading,
      aiModelCreatedData: state.aiModel.aiModelCreatedData
    }),
    shallowEqual
  );

  const [formData, setFormData] = useState({
    modelS3Url: s3DataHandlerFormData ? s3DataHandlerFormData.modelS3Url : "",
    modelS3Key: s3DataHandlerFormData ? s3DataHandlerFormData.modelS3Key : "",
    modelS3Name: s3DataHandlerFormData ? s3DataHandlerFormData.modelS3Name : "",
    modelVersion: s3DataHandlerFormData
      ? s3DataHandlerFormData.modelVersion
      : "",
    status: false,
    modelId: s3DataHandlerFormData ? s3DataHandlerFormData.modelId : "",
    modelS3DataId: s3DataHandlerFormData
      ? s3DataHandlerFormData.modelS3DataId
      : ""
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(action.fetchAIModel());
  }, []);

  const handleChange = (key, event) => {
    let value = event.target.value;
    let data = { ...formData };
    data[key] = value;
    setFormData(data);
    dispatch(actions.setS3DataHandlerFormData(data));
  };
  const handleSelect = (key, value) => {
    let data = { ...formData };
    data[key] = value;
    setFormData(data);

    dispatch(actions.setS3DataHandlerFormData(data));
  };

  return (
    <Card>
      {actionsLoading && (
        <div className="overlay-layer bg-transparent">
          <div className="spinner spinner-lg spinner-success" />
        </div>
      )}
      <CardHeader title="Add S3 Data Handler">
        {/*<CardHeaderToolbar>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={usersUIProps.newUserButtonClick}
                    >
                        Add S3 Data Handler
                    </button>
                </CardHeaderToolbar>*/}
      </CardHeader>
      <CardBody>
        <Form>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model S3 Name
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model S3 Name"
                defaultValue={formData.modelS3Name}
                onChange={event => handleChange("modelS3Name", event)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model S3 URL
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model S3 URL"
                defaultValue={formData.modelS3Url}
                onChange={event => handleChange("modelS3Url", event)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model S3 Key
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model S3 Key"
                defaultValue={formData.modelS3Key}
                onChange={event => handleChange("modelS3Key", event)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Version
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Version"
                defaultValue={formData.modelVersion}
                onChange={event => handleChange("modelVersion", event)}
              />
            </Col>
          </Form.Group>
        </Form>
      </CardBody>
    </Card>
  );
}
