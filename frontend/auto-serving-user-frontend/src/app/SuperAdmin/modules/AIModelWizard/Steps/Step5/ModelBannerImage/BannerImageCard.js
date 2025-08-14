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
import { useUsersUIContext } from "./BannerImageUIContext";
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
import { ModelBannerImageSlice } from "../../../_redux/ModelBannerImage/ModelBannerImageSlice";
const { actions } = ModelBannerImageSlice;

export function BannerImageCard() {
  const dispatch = useDispatch();
  const {
    aiModelDetails,
    modelBannerImageFormData,
    actionsLoading
  } = useSelector(
    state => ({
      aiModelDetails: state.aiModel.aiModelDetails,
      modelBannerImageFormData: state.modelBannerImage.modelBannerImageFormData,
      actionsLoading: state.modelBannerImage.actionsLoading
    }),
    shallowEqual
  );

  const [formData, setFormData] = useState({
    image: modelBannerImageFormData ? modelBannerImageFormData.image : "",
    modelId: modelBannerImageFormData ? modelBannerImageFormData.modelId : ""
  });

  const handleChange = (key, event) => {
    let value = event.target.files[0];
    let data = { ...formData };
    data[key] = value;
    setFormData(data);
    dispatch(actions.setModelBannerImageFormData(data));
  };
  const handleSelect = (key, value) => {
    let data = { ...formData };
    data[key] = value;
    setFormData(data);

    dispatch(actions.setModelBannerImageFormData(data));
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
      <CardHeader title="Add Model Banner Image">
        {/*<CardHeaderToolbar>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={usersUIProps.newUserButtonClick}
                    >
                        Add Model Banner Image
                    </button>
                </CardHeaderToolbar>*/}
      </CardHeader>
      <CardBody>
        <Form>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              Model Banner Image
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

        {/*<UsersFilter />*/}
        {/*{customersUIProps.ids.length > 0 && <CustomersGrouping />}*/}
        {/*<UsersTable />*/}
      </CardBody>
    </Card>
  );
}
