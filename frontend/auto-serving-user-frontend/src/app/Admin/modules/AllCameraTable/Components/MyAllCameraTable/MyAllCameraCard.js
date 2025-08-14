import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip
} from "react-bootstrap";
import { getTotalCamerasByLocationId } from "../../../DashboardGraph/_redux";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { CardBody } from "reactstrap";
import { getEnabledLocationList } from "../../../AddSupervisor/_redux";
import { warningToast } from "../../../../../../utils/ToastMessage";
import { shallowEqual, useSelector } from "react-redux";
import {
  getAllCameraLocationModalData,
  getAllModalFromListOfCameraId
} from "../../_redux/MyAllCameraApi";
import { MyAllCameraTable } from "./MyAllCameraTable";

const customStyles = {
  option: (styles, state) => ({
    ...styles,
    cursor: "pointer"
  }),
  control: styles => ({
    ...styles,
    cursor: "pointer"
  })
};

function MyAllCameraCard() {
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedCurrentLocation, setSelectedCurrentLocation] = useState({
    label: "ALL Location",
    value: "-1"
  });
  const [
    selectedCurrentLocationOptions,
    setSelectedCurrentLocationOptions
  ] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(["-1"]);

  const [
    totalCamerasByLocationLoading,
    setTotalCamerasByLocationLoading
  ] = useState(false);
  const [cameraLocationId, setCameraLocationId] = useState(["-1"]);
  const [cameraLocationOptions, setCameraLocationOptions] = useState([]);
  const [SelectedCameraByLocationId, setSelectedCameraByLocationId] = useState({
    label: "All Camera",
    value: "-1"
  });

  const [totalModalByCameraLoading, setTotalModalByCameraLoading] = useState(
    false
  );
  const [modalByCamerasId, setModalByCamerasId] = useState(["-1"]);
  const [modalByCamerasOptions, setModalByCamerasOptions] = useState([]);
  const [SelectedModalByCameraId, setSelectedModalByCameraId] = useState({
    label: "All Model",
    value: "-1"
  });

  const [listLoading, setListLoading] = useState(false);
  const [currentItems, setCurrentItems] = useState([]);
  const [showTable, setShowTable] = useState(true);

  const [clearFilterFlag, setClearFilterFlag] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    getAllLocations();
  }, []);

  const { userRole } = useSelector(
    ({ auth }) => ({
      userRole: auth.user?.roles?.length && auth.user.roles[0]?.role
    }),
    shallowEqual
  );

  const getAllLocations = () => {
    setLocationLoading(true);
    getEnabledLocationList(userRole)
      .then(response => {
        if (response && response.data) {
          let locationOptions = [];
          response.data.map(obj =>
            locationOptions.push({ label: obj.location_name, value: obj.id })
          );
          locationOptions.push({ label: "All Location", value: -1 });
          setLocationLoading(false);
          setSelectedCurrentLocationOptions(locationOptions);
          handleLocationChange([{ label: "All Location", value: -1 }]);
        }
      })
      .catch(error => {
        setLocationLoading(false);
        if (error.detail) {
          warningToast(error.detail);
        } else {
          warningToast("Something went Wrong");
        }
      });
  };

  const handleLocationChange = selectedCurrentLocation => {
    if (!selectedCurrentLocation) {
      handleCameraChange();
      setSelectedCameraByLocationId([]);
      setCameraLocationId([]);

      setModalByCamerasId([]);
      setSelectedModalByCameraId([]);
    }
    let selectedLocationArray = [];
    if (selectedCurrentLocation && selectedCurrentLocation.length > 0) {
      for (let i = 0; i < selectedCurrentLocation.length; i++) {
        selectedLocationArray.push(selectedCurrentLocation[i].value.toString());
      }
    } else {
      handleCameraChange();
      setSelectedCameraByLocationId([]);
      setCameraLocationId([]);

      setModalByCamerasId([]);
      setSelectedModalByCameraId([]);
    }
    setSelectedCurrentLocation(selectedCurrentLocation);
    setCurrentLocation(selectedLocationArray);

    if (selectedCurrentLocation && selectedCurrentLocation.length > 0) {
      let location_list = [];
      selectedCurrentLocation.map((item, index) => {
        let x = parseInt(item.value.toString());
        location_list.push(x);
        return null;
      });
      setTotalCamerasByLocationLoading(true);
      getTotalCamerasByLocationId(location_list)
        .then(res => {
          if (res && res.isSuccess) {
            let cameras = [];
            let camOpt = [];
            res.data.map((item, index) => {
              camOpt.push({ label: item.camera_name, value: item.id });
              return null;
            });
            cameras.push("-1");
            camOpt.push({ label: "All Camera", value: -1 });
            setCameraLocationId(cameras);
            setCameraLocationOptions(camOpt);
            let selectedCurrentLocationData = [];
            selectedCurrentLocation.map(x => {
              if (x.value === -1) {
                selectedCurrentLocationData.push(x.value);
              }
            });
            setTotalCamerasByLocationLoading(false);
            handleCameraChange([{ label: "All Camera", value: -1 }]);
          } else {
            setTotalCamerasByLocationLoading(false);
            warningToast("Something went wrong");
          }
        })
        .catch(error => {
          setTotalCamerasByLocationLoading(false);
          if (error.detail) {
            warningToast(error.detail);
          } else {
            warningToast("Something went Wrong");
          }
        });
    } else {
    }
  };

  const handleCameraChange = selectedLocation => {
    if (!selectedLocation) {
      setModalByCamerasId([]);
      setSelectedModalByCameraId([]);
    }

    let selectedLocationArray = [];
    if (selectedLocation && selectedLocation.length > 0) {
      for (let i = 0; i < selectedLocation.length; i++) {
        selectedLocationArray.push(selectedLocation[i].value.toString());
      }
    } else {
      setModalByCamerasId([]);
      setSelectedModalByCameraId([]);
    }

    setSelectedCameraByLocationId(selectedLocation);
    setCameraLocationId(selectedLocationArray);
    if (selectedLocation && selectedLocation.length > 0) {
      let camera_list = [];
      selectedLocation.map((item, index) => {
        let x = parseInt(item.value);
        camera_list.push(x);
        return null;
      });
      setTotalModalByCameraLoading(true);
      getAllModalFromListOfCameraId(camera_list)
        .then(res => {
          if (res && res.isSuccess) {
            let modals = [];
            let modalOpt = [];
            res.data.map((item, index) => {
              modalOpt.push({
                label: item.model_name,
                value: item.id.toString()
              });
              return null;
            });
            modals.push("-1");
            modalOpt.push({ label: "All Model", value: -1 });
            setModalByCamerasId(modals);
            setModalByCamerasOptions(modalOpt);
            let selectedCurrentLocationData = [];
            selectedLocation.map(x => {
              if (x.value === -1) {
                selectedCurrentLocationData.push(x.value);
              }
            });
            setTotalModalByCameraLoading(false);
            handleLabelChange([{ label: "All Model", value: -1 }]);
          } else {
            setTotalModalByCameraLoading(false);
            warningToast("Something went wrong");
          }
        })
        .catch(error => {
          setTotalModalByCameraLoading(false);
          if (error.detail) {
            warningToast(error.detail);
          } else {
            warningToast("Something went Wrong");
          }
        });
    } else {
    }
  };

  const handleLabelChange = selectedModal => {
    let selectedLabelArray = [];
    if (selectedModal) {
      for (let i = 0; i < selectedModal.length; i++) {
        selectedLabelArray.push(selectedModal[i].value);
      }
    }
    setSelectedModalByCameraId(selectedModal);
    setModalByCamerasId(selectedLabelArray);
  };

  const clearFilter = () => {
    setTotalCount(0);
    setCurrentLocation([-1]);
    setCameraLocationId([-1]);
    setModalByCamerasId([-1]);
    setClearFilterFlag(true);
    getAllLocations();
    setPageNo(1);
    setPageSize(10);
  };

  useEffect(() => {
    if (clearFilterFlag) {
      let body = {
        location_id: currentLocation,
        camera_id: cameraLocationId,
        model_id: modalByCamerasId
      };
      getAllCameraLocationModal(body, pageNo, pageSize);
    }
  }, [clearFilterFlag]);

  useEffect(() => {
    if (currentLocation && cameraLocationId && modalByCamerasId) {
      let body = {
        location_id: currentLocation,
        camera_id: cameraLocationId,
        model_id: modalByCamerasId
      };
      getAllCameraLocationModal(body, pageNo, pageSize);
    }
  }, [pageNo, pageSize]);

  function getAllCameraLocationModal(body, pageNo, pageSize) {
    setShowTable(true);
    getAllCameraLocationModalData(body, pageNo, pageSize)
      .then(response => {
        if (response && response.isSuccess) {
          setPageNo(response.data.page);
          setPageSize(response.data.size);
          setTotalCount(response.data.total);
          setShowTable(false);
          setClearFilterFlag(false);
          setListLoading(false);
          setCurrentItems(response.data.items);
        } else throw new Error();
      })
      .catch(error => {
        setShowTable(false);
        setCurrentItems([]);
        if (error.detail) {
          warningToast(error.detail);
        } else {
          warningToast("Something went Wrong");
        }
      });
  }

  const sizePerPageChangeApiCall = (page, sizePerPage) => {
    setPageNo(1);
    setPageSize(sizePerPage);
  };

  const pageChange = (page, sizePerPage) => {
    setPageNo(page);
    setPageSize(sizePerPage);
  };

  const applyFilter = () => {
    if (currentLocation?.length < 1) {
      warningToast("Please Select Location");
    } else if (cameraLocationId?.length < 1) {
      warningToast("Please Select Camera");
    } else if (modalByCamerasId?.length < 1) {
      warningToast("Please Select Model");
    }

    if (
      currentLocation.length > 0 &&
      cameraLocationId.length > 0 &&
      modalByCamerasId.length > 0
    ) {
      if (pageNo === 1) {
        let body = {
          location_id: currentLocation,
          camera_id: cameraLocationId,
          model_id: modalByCamerasId
        };
        getAllCameraLocationModal(body, 1, 10);
      } else {
        setPageNo(1);
        setPageSize(10);
      }
    }
  };

  return (
    <Card className="example example-compact ">
      <Row>
        <Col xl={8} xs={12} md={7} sm={12} lg={8}>
          <CardHeader title="All Camera" />
        </Col>
      </Row>
      <hr />
      <CardBody style={{ padding: "1rem " }}>
        <Row>
          <Col xl={3} xs={12} md={6} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label className="mb-4">Select Location</Form.Label>
              <Select
                theme={theme => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82"
                  }
                })}
                styles={customStyles}
                isLoading={locationLoading}
                isSearchable={false}
                isMulti={true}
                placeholder="Select Location"
                className="select-react-dropdown"
                value={selectedCurrentLocation}
                onChange={handleLocationChange}
                options={selectedCurrentLocationOptions}
              />
            </Form.Group>
          </Col>
          <Col xl={3} xs={12} md={6} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label className="mb-4">Select Camera</Form.Label>
              <Select
                theme={theme => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82"
                  }
                })}
                styles={customStyles}
                isMulti={true}
                isLoading={totalCamerasByLocationLoading}
                placeholder="Select Camera"
                value={SelectedCameraByLocationId}
                onChange={handleCameraChange}
                options={cameraLocationOptions}
              />
            </Form.Group>
          </Col>
          <Col xl={3} xs={12} md={6} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label className="mb-4">Select Model</Form.Label>
              <Select
                theme={theme => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82"
                  }
                })}
                styles={customStyles}
                isLoading={totalModalByCameraLoading}
                isMulti={true}
                placeholder={"Select Label"}
                value={SelectedModalByCameraId}
                onChange={handleLabelChange}
                options={modalByCamerasOptions}
              />
            </Form.Group>
          </Col>
          <Col xl={3} xs={12} md={12} sm={12}>
            <div className={"d-flex mr-2 mt-5"}>
              <Button
                className={"mt-xl-5 mt-sm-3 mb-sm-3 btn btn-elevate "}
                onClick={applyFilter}
              >
                Apply Filter
              </Button>
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="user-notification-tooltip">
                    Show All Data
                  </Tooltip>
                }
              >
                <Button
                  type="button"
                  onClick={clearFilter}
                  className="mt-xl-5 mt-sm-3 mb-sm-3 ml-5 btn btn-light btn-elevate "
                >
                  Reset filter
                </Button>
              </OverlayTrigger>
            </div>
          </Col>
        </Row>

        <MyAllCameraTable
          currentLocation={currentLocation}
          cameraLocationId={cameraLocationId}
          modalByCamerasId={modalByCamerasId}
          getAllCameraLocationModal={getAllCameraLocationModal}
          listLoading={listLoading}
          setListLoading={setListLoading}
          currentItems={currentItems}
          setCurrentItems={setCurrentItems}
          showTable={showTable}
          setShowTable={setShowTable}
          pageNo={pageNo}
          pageSize={pageSize}
          totalCount={totalCount}
          setPageSize={setPageSize}
          setPageNo={setPageNo}
          pageChange={(page, sizePerPage) => pageChange(page, sizePerPage)}
          sizePerPageChangeApiCall={(page, sizePerPage) =>
            sizePerPageChangeApiCall(page, sizePerPage)
          }
        />
      </CardBody>
    </Card>
  );
}

export default MyAllCameraCard;
