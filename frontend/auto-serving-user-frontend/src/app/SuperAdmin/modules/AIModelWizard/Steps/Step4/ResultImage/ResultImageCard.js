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
import { useUsersUIContext } from "./ResultImageUIContext";
import {
  Col,
  DropdownButton,
  Form,
  FormFile,
  Modal,
  Row
} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import Select from "react-select";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as action from "../../../../AIModel/_redux/AiModelAction";
import { ModelResultImageSlice } from "../../../_redux/ModelResultImage/ModelResultImageSlice";
const { actions } = ModelResultImageSlice;

export function ResultImageCard() {
  const dispatch = useDispatch();
  const {
    aiModelDetails,
    modelResultImageFormData,
    actionsLoading
  } = useSelector(
    state => ({
      aiModelDetails: state.aiModel.aiModelDetails,
      modelResultImageFormData: state.modelResultImage.modelResultImageFormData,
      actionsLoading: state.modelResultImage.actionsLoading
    }),
    shallowEqual
  );

  const [formData, setFormData] = useState({
    image: modelResultImageFormData ? modelResultImageFormData.image : "",
    modelId: modelResultImageFormData ? modelResultImageFormData.modelId : ""
  });

  const handleChange = (key, event) => {
    let value = event.target.files[0];
    let data = { ...formData };
    data[key] = value;
    setFormData(data);
    dispatch(actions.setModelResultImageFormData(data));
  };
  const handleSelect = (key, value) => {
    let data = { ...formData };
    data[key] = value;
    setFormData(data);

    dispatch(actions.setModelResultImageFormData(data));
  };

  useEffect(() => {
    dispatch(action.fetchAIModel());
  }, []);

  return (
    <Card>
      {actionsLoading && (
        <div className="overlay-layer bg-transparent">
          <div className="spinner spinner-lg spinner-success" />
        </div>
      )}
      <CardHeader title="Add Model Result Image">
        {/*<CardHeaderToolbar>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={usersUIProps.newUserButtonClick}
                    >
                        Add Model Result Image
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
              Model Result Image
            </Form.Label>
            <Col sm={8}>
              <label className="cursor-pointer">
                <FormFile>
                  <FormFile.Input
                    onChange={event => handleChange("image", event)}
                  />
                </FormFile>
              </label>
            </Col>
          </Form.Group>
        </Form>
      </CardBody>
    </Card>
  );
}
