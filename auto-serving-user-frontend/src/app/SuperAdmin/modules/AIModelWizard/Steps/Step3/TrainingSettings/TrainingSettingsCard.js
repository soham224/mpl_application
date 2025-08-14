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
import { useUsersUIContext } from "./TrainingSettingsUIContext";
import { Col, DropdownButton, Form, Modal, Row } from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import Select from "react-select";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as action from "../../../../AIModel/_redux/AiModelAction";
import { TrainingSettingsSlice } from "../../../_redux/TrainingSettings/TrainingSettingsSlice";
const { actions } = TrainingSettingsSlice;

export function TrainingSettingsCard() {
  const {
    aiModelDetails,
    trainingSettingsFormData,
    actionsLoading
  } = useSelector(
    state => ({
      aiModelDetails: state.aiModel.aiModelDetails,
      trainingSettingsFormData: state.trainingSettings.trainingSettingsFormData,
      actionsLoading: state.trainingSettings.actionsLoading
    }),
    shallowEqual
  );

  const [formData, setFormData] = useState({
    imageSize: trainingSettingsFormData
      ? trainingSettingsFormData.imageSize
      : "",
    modelTrainingBatchSize: trainingSettingsFormData
      ? trainingSettingsFormData.modelTrainingBatchSize
      : "",
    batchSize: trainingSettingsFormData
      ? trainingSettingsFormData.batchSize
      : "",
    modelEpochs: trainingSettingsFormData
      ? trainingSettingsFormData.modelEpochs
      : "",
    modelLabelsList: trainingSettingsFormData
      ? trainingSettingsFormData.modelLabelsList
      : "",
    status: false,
    modelId: trainingSettingsFormData ? trainingSettingsFormData.modelId : "",
    trainingSettingsId: trainingSettingsFormData
      ? trainingSettingsFormData.trainingSettingsId
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
    dispatch(actions.setTrainingSettingsFormData(data));
  };
  const handleSelect = (key, value) => {
    let data = { ...formData };
    data[key] = value;
    setFormData(data);

    dispatch(actions.setTrainingSettingsFormData(data));
  };

  return (
    <Card>
      {actionsLoading && (
        <div className="overlay-layer bg-transparent">
          <div className="spinner spinner-lg spinner-success" />
        </div>
      )}

      <CardHeader title="Add Training Settings">
        {/* <CardHeaderToolbar>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={usersUIProps.newUserButtonClick}
                    >
                        Add Training Settings
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
              Image size
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Image Size"
                defaultValue={formData.imageSize}
                onChange={event => handleChange("imageSize", event)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Training Batch size
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Training Batch size"
                defaultValue={formData.modelTrainingBatchSize}
                onChange={event =>
                  handleChange("modelTrainingBatchSize", event)
                }
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Batch size
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Batch Size"
                defaultValue={formData.batchSize}
                onChange={event => handleChange("batchSize", event)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Epochs
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Epochs"
                defaultValue={formData.modelEpochs}
                onChange={event => handleChange("modelEpochs", event)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Labels List
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Model Labels List"
                defaultValue={formData.modelLabelsList}
                onChange={event => handleChange("modelLabelsList", event)}
              />
            </Col>
          </Form.Group>
        </Form>
      </CardBody>
    </Card>
  );
}
