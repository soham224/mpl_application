import React, { useEffect, useMemo, useRef, useState } from "react";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import {
  entityFilter,
  getFilteredAndPaginatedEntities,
  getPaginationOptions,
  headerSortingClasses,
  sortCaret,
  toAbsoluteUrl,
} from "../../../../_metronic/_helpers";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { warningToast } from "../../../../utils/ToastMessage";
import SweetAlert from "react-bootstrap-sweetalert";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import { Button, Col, Container, Row } from "reactstrap";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import CardHeader from "@material-ui/core/CardHeader";
import AddSupervisorModal from "../Modal/addSupervisorModal";
import AssignLocationModal from "../Modal/assignLocationModal";
import { getSupervisorList, updateSupervisorStatus } from "./_redux";
import SVG from "react-inlinesvg";
import Switch from "@material-ui/core/Switch/Switch";
import { useSupervisorUIContext } from "./SupervisorUIContext";
import { AutoServingTable } from "../../../../utils/AutoServingTable";
import { SearchText } from "../../../../utils/SearchText";

export default function AddSupervisor() {
  // Customers UI Context
  const supervisorUIContext = useSupervisorUIContext();
  const supervisorUIProps = useMemo(
    () => supervisorUIContext,
    [supervisorUIContext]
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [columns, setColumns] = React.useState([]);
  const [assignLocationModal, setAssignLocationModal] = React.useState(false);
  const [showTable, setShowTable] = React.useState(false);
  const [selected_user_id, setSelectedUserId] = React.useState("");
  const [selected_user_location, setSelectedUserLocation] = React.useState("");
  const [blocking, setBlocking] = React.useState(false);
  const [specific_user_id, setSpecificUserId] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [cellContent, setCellContent] = React.useState([]);
  const [row, setRow] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [showNoDataFound, setShowNoDataFound] = React.useState(false);
  const handleUserStatus = (cellContent, row) => {
    let updateStatus = {
      user_status: !cellContent[0].user_status,
      user_id: cellContent[0].id,
    };
    blockAddSupervisor();
    updateSupervisorStatus(updateStatus)
      .then((response) => {
        if (response && response.isSuccess) {
          getAllSupervisorList();
        } else {
          warningToast("Something went wrong");
        }
        toggleShowAlert();
      })
      .catch((error) => {
        toggleShowAlert();
        if (error.detail) {
          warningToast(error.detail);
        } else {
          warningToast("Something went Wrong");
        }
      });
  };

  const handleAssignLocation = (cellContent, row) => {
    setSelectedUserId(row);
    setSpecificUserId(cellContent[0].id);
    setSelectedUserLocation(cellContent[0].location);
    setTimeout(() => {
      toggleLocationModal();
    }, 500);
  };

  function blockAddSupervisor() {
    setBlocking(!blocking);
  }

  const getAllSupervisorList = () => {
    const columns = [
      {
        dataField: "id",
        text: "INDEX",
        sort: true,
        sortCaret: sortCaret,
        headerSortingClasses,
      },
      {
        dataField: "email",
        text: "Email",
        sort: true,
        sortCaret: sortCaret,
        headerSortingClasses,
      },
      {
        dataField: "locations",
        text: "Locations",
        sort: true,
        sortCaret: sortCaret,
        headerSortingClasses,
      },
      {
        dataField: "assignlocation",
        text: "Actions",
        style: {
          minWidth: "150px",
        },
        formatter: (cellContent, row) => {
          return (
            <>
              <Button
                className="btn btn-icon mr-4 btn-light btn-hover-primary btn-hover-light-inverse btn-sm mx-3"
                onClick={() => handleAssignLocation(cellContent, row)}
              >
                <span className="svg-icon svg-icon-md svg-icon-primary">
                  <SVG
                    title="Assign locations"
                    src={toAbsoluteUrl(
                      "/media/svg/icons/Communication/Write.svg"
                    )}
                  />
                </span>
              </Button>
              <Switch
                checked={cellContent[0].user_status}
                onChange={() => setShowAlert1(cellContent, row)}
                color="primary"
              />
            </>
          );
        },
      },
    ];
    setBlocking(true);
    getSupervisorList()
      .then((response) => {
        let data = [];
        if (response && response.isSuccess) {
          let responseData = response.data;
          for (let i = 0; i < responseData.length; i++) {
            let obj = responseData[i];
            let locationObj = [];
            let locationId = [];
            let userStatus = "";
            let actions = [];
            if (obj.locations && obj.locations.length > 0) {
              for (let j = 0; j < obj.locations.length; j++) {
                let objLocationName = obj.locations[j];
                locationObj.push(objLocationName.location_name);
                locationId.push({
                  label: objLocationName.location_name,
                  value: objLocationName.id,
                });
              }
            }
            userStatus = obj.user_status;
            actions.push({
              user_status: userStatus,
              location: locationId,
              id: obj.id,
            });
            data.push({
              id: i + 1,
              email: obj.user_email,
              locations: locationObj.toString(),
              assignlocation: actions,
            });
          }

          setColumns(columns);
          setData(data);
          setFilterEntities(data);
          setTimeout(() => {
            if (data.length > 0) {
              setShowTable(true);
              setShowNoDataFound(true);
              setBlocking(false);
            } else {
              setShowTable(false);
              setShowNoDataFound(true);
            }
            setBlocking(false);
          }, 500);
        }
      })
      .catch((error) => {
        if (error.detail) {
          warningToast(error.detail);
        } else {
          warningToast("Something went Wrong");
        }
        setShowTable(false);
        setShowNoDataFound(true);
        setBlocking(false);
      });
  };
  useEffect(() => {
    getAllSupervisorList();
    //eslint-disable-next-line
  }, [supervisorUIProps.queryParams, modalOpen, assignLocationModal]);

  function toggleSupervisorModal() {
    setModalOpen(!modalOpen);
  }

  function toggleLocationModal() {
    setAssignLocationModal(!assignLocationModal);
  }
  const setShowAlert1 = (cellContent, row) => {
    setShowAlert(true);
    setCellContent(cellContent);
    setRow(row);
  };

  function toggleShowAlert() {
    setShowAlert(false);
  }

  const searchInput = useRef("");
  const [filterEntities, setFilterEntities] = useState(data);
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || data,
    supervisorUIProps.queryParams
  );
  const filterSupervisor = (e) => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = ["id", "email"];
    currentItems = entityFilter(
      data,
      searchStr,
      keys,
      supervisorUIProps.queryParams,
      setFilterEntities
    );
  };
  useEffect(() => {
    filterSupervisor();
    //eslint-disable-next-line
  }, [data]);

  return (
    <>
       <Container className={"p-0"} fluid={true}>
          <Card
            className="example example-compact"
            style={{ minHeight: "300px" }}
          >
            <CardBody style={{ minHeight: "300px", padding: "10px 10px" }}>
              <Row>
                <Col xl={10} md={8} xs={12} sm={8}>
                  <CardHeader title="Supervisor Details" />
                </Col>
                <Col
                  xl={2}
                  md={4}
                  xs={12}
                  sm={4}
                  style={{
                    marginTop: "10px",
                    textAlign: "right",
                  }}
                  className="header-btn"
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={toggleSupervisorModal}
                  >
                    Add supervisor
                  </button>
                  {modalOpen && (
                    <AddSupervisorModal
                      blockAddSupervisor={blockAddSupervisor}
                      modalOpen={modalOpen}
                      toggleSupervisorModal={toggleSupervisorModal}
                    />
                  )}
                </Col>
              </Row>
              <hr />
              <BlockUi tag="div" blocking={blocking} color="#147b82">

              <Row>
                <Col
                  xl={12}
                  style={{ padding: "10px 20px", minWidth: "300px" }}
                >
                  {showTable && (
                    <PaginationProvider
                      pagination={paginationFactory(
                        getPaginationOptions(
                          filterEntities.length,
                          supervisorUIProps.queryParams
                        )
                      )}
                    >
                      {({ paginationProps, paginationTableProps }) => {
                        return (
                          <Pagination paginationProps={paginationProps}>
                            <div className="row mb-5">
                              <Col xl={3} lg={6} xs={12} md={12}>
                                <div className={"searchText"}>
                                  <SearchText
                                    reference={searchInput}
                                    onChangeHandler={filterSupervisor}
                                  />
                                </div>
                              </Col>
                            </div>
                            <AutoServingTable
                              columns={columns}
                              items={currentItems}
                              tableChangeHandler={
                                supervisorUIProps.setQueryParams
                              }
                              paginationTableProps={paginationTableProps}
                            />
                          </Pagination>
                        );
                      }}
                    </PaginationProvider>
                  )}
                  {!showTable && showNoDataFound && (
                    <h3 style={{ paddingTop: "40px" }} className="text-center">
                      No Data Found
                    </h3>
                  )}
                  {assignLocationModal && (
                    <AssignLocationModal
                      specific_user_id={specific_user_id}
                      blockAddSupervisor={blockAddSupervisor}
                      selectedUserLocation={selected_user_location}
                      selectedUser={selected_user_id}
                      toggleLocationModal={toggleLocationModal}
                      modalOpen={assignLocationModal}
                    />
                  )}
                </Col>
              </Row>
              </BlockUi>
            </CardBody>
          </Card>
          <SweetAlert
            // info={!isSuccess}
            showCancel={true}
            showConfirm={true}
            confirmBtnText="Confirm"
            confirmBtnBsStyle="primary"
            cancelBtnBsStyle="light"
            cancelBtnStyle={{ color: "black" }}
            title={"Are you sure ?"}
            onConfirm={() => {
              handleUserStatus(cellContent, row);
            }}
            onCancel={toggleShowAlert}
            show={showAlert}
            focusCancelBtn
          />
        </Container>

    </>
  );
}
