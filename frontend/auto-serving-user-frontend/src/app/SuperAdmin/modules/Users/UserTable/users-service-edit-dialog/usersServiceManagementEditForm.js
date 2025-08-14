import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { warningToast } from "../../../../../../utils/ToastMessage";
import {
  headerSortingClasses,
  sortCaret
} from "../../../../../../_metronic/_helpers";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import Switch from "@material-ui/core/Switch/Switch";

const data = [
  { idx: 1, service_name: "whatsapp 0" },
  { idx: 2, service_name: "whatsapp 1" },
  { idx: 3, service_name: "whatsapp 2" },
  { idx: 4, service_name: "whatsapp 3" },
  { idx: 5, service_name: "whatsapp 4" },
  { idx: 6, service_name: "whatsapp 5" },
  { idx: 7, service_name: "whatsapp 6" },
  { idx: 8, service_name: "whatsapp 7" },
  { idx: 9, service_name: "whatsapp 8" },
  { idx: 10, service_name: "whatsapp 9" },
  { idx: 11, service_name: "whatsapp 10" }
];
export function UsersServiceManagementEditForm({
onHide
}) {
  const [formData, setFormData] = useState({
    frameworkName: "",
    frameworkDescription: "",
    frameworkVersion: "",
    status: false,
    id: ""
  });

  const [showAddUserSerivce, setShowAddUserSerivce] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const isValidate = () => {
    if (!formData.frameworkName) warningToast("Please Enter Framework Name");
    else if (!formData.frameworkDescription)
      warningToast("Please Enter Framework Description");
    else if (!formData.frameworkVersion)
      warningToast("Please Enter Framework Version");
    else return true;

    return false;
  };

  const columns = [
    {
      dataField: "idx",
      text: "Index",
      style: {
        minWidth: "55px"
      }
    },
    {
      dataField: "service_name",
      text: "Service Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses
    },
      {
          dataField: "due_date",
          text: "Due Date",
          sort: true,
          sortCaret: sortCaret,
          headerSortingClasses
      },
    {
      dataField: "action",
      text: "Actions",
      formatter: (cellContent, row) => {
        return (
          <>
            <Switch
              onChange={() => openChangeStatusAlert(cellContent, row)}
              color="primary"
            />
          </>
        );
      }
    }
  ];

  const openChangeStatusAlert = (cellContent, row) => {
    // console.log("cellContent, row", cellContent, row);
  };

  const onHideAddServiceModal = () => {
    setShowAddUserSerivce(false);
  };

  const handleAddServiceSubmit = () => {
    setShowAddUserSerivce(false);
  };

  const onPageChange = (page, sizePerPage) => {
    // console.log("onPageChange page, sizePerPage", page, sizePerPage);
  };
  const onSizePerPageChange = (page, sizePerPage) => {
    // console.log("onSizePerPageChange page, sizePerPage", page, sizePerPage);
  };

  const onChangeSearch = (event) =>{
      setSearchText(event.target.value)
  }

  return (
    <>
      <Modal.Body>
        <Row>
          <div className={"col-12 d-flex mb-5"}>

              <div className={ "col-xl-3"}>
                  <input
                      style={{ width: "auto" }}
                      type="text"
                      className="form-control"
                      name="searchText"
                      placeholder="Search For Name"
                      // onChange={onChangeSearch}
                      // ref={reference}
                  />
              </div>
              <div className={ "col-xl-9"}>
            <button
              type="submit"
              onClick={() => setShowAddUserSerivce(!showAddUserSerivce)}
              className="btn btn-primary btn-elevate float-right "
            >
              Add Service
            </button>
              </div>

          </div>
        </Row>
        <Row>

            <BootstrapTable
            classes="table reportTable  table-vertical-center table-horizontal-center "
            bootstrap4
            wrapperClasses="table-responsive"
            keyField="id"
            data={data}
            columns={columns}
            pagination={paginationFactory({
              sizePerPage: sizePerPage,
              page: page,
              totalSize: data.length,
              showTotal: true,
              sizePerPageList: [
                { text: "3", value: 3 },
                { text: "5", value: 5 },
                { text: "10", value: 10 }
              ],
              hideSizePerPage: false,
              alwaysShowAllBtns: true,
              hidePageListOnlyOnePage: true,
              onPageChange: onPageChange,
              onSizePerPageChange: onSizePerPageChange
            })}
          />

        </Row>
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
          className="btn btn-primary btn-elevate"
        >
          Save
        </Button>
      </Modal.Footer>

      {showAddUserSerivce ? (
        <>
          <Modal
            size="lg"
            show={showAddUserSerivce}
            onHide={onHideAddServiceModal}
            centered
            aria-labelledby="contained-modal-title-vcenter"
            style={{ background: "#00000080" }}
          >
            <Modal.Header closeButton={onHideAddServiceModal}>
              <Modal.Title id="example-modal-sizes-title-lg">
                Add Services
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="locationName" as={Row}>
                  <Form.Label column sm={4}>
                    Service Name
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Group>
                      <Select
                        theme={theme => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: "#5DBFC4",
                            primary: "#147b82"
                          }
                        })}
                        name="labelOptions"
                        isSearchable={false}
                        isMulti={true}
                        placeholder="Select Service"
                        // isLoading={labelLoading}
                        className="select-react-dropdown"
                      />
                    </Form.Group>
                  </Col>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                onClick={onHideAddServiceModal}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </Button>
              <> </>
              <Button
                type="submit"
                onClick={handleAddServiceSubmit}
                className="btn btn-primary btn-elevate"
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>{" "}
        </>
      ) : (
        <></>
      )}
    </>
  );
}
