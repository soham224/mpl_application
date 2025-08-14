import React, {useEffect, useState} from "react";
import {Card, CardBody} from "../../../../../../../_metronic/_partials/controls";
import CardHeader from "@material-ui/core/CardHeader";
import {MyEventViewTable} from "./my-event-view-table/MyEventViewTable";
import Select from "react-select";
import {Button, Col, Form, Row} from "react-bootstrap";
import {getEnabledLocationListResultManager, getResultManagerTotalCameras} from "../../../_redux/MyEventViewApi";
import {warningToast} from "../../../../../../../utils/ToastMessage";
import "react-datetime/css/react-datetime.css";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import "react-multi-date-picker/styles/colors/teal.css";
import {getAllUsersResultManager} from "../../../../../../SuperAdmin/modules/Users/_redux/users.api";
import {shallowEqual, useSelector} from "react-redux";
import {Switch} from "@material-ui/core";
import {
  getCurrentDayEndDateWithTimeInUtc,
  getCurrentDayStartDateWithTimeInUtc,
  getUtcDateAndTimeFromCalendar
} from "../../../../../../../utils/TimeZone";
import {getEventModalType} from "../../../../MyEvents/_redux/MyEventApi";


export function MyEventViewCard() {
  const initCompany = { label: "Select Company", value: 0 };
  const [company, setCompany] = useState(initCompany);
  const [camera, setCamera] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [values, setValues] = useState([startDate, endDate]);
  const [show, setShow] = useState(false);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedTypeArray, setSelectedTypeArray] = useState([]);
  const [initialCameras, setInitialCameras] = useState([]);
  const [labelOptions, setLabelOptions] = useState([]);
  const [location, setLocation] = useState([]);
  const [cameraOptions, setCameraOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [switchToggle, setSwitchToggle] = useState(false);
  const [detectionSwitchToggle, setDetectionSwitchToggle] = useState(true);
  const [viewAllSwitchToggle, setViewAllSwitchToggle] = useState(true);
  const [selectedcameraid, setSelctedcameraid] = useState([]);
  const [selectedLocationid, setSelectedLocationid] = useState([]);
  const [camerasIds, setCamerasIds] = useState([]);
  const [isHide, setIsHide] = useState(false);
  const [isDetection, setIsDetection] = useState(true);
  const [isViewAll, setIsViewAll] = useState(true);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [applyFlag, setApplyFlag] = useState(false)

  useEffect(() => {
    getAllUsersResultManager()
      .then(response => {
        if (response && response.isSuccess) {
          setCompanyOptions(
            response.data.map(user => ({
              value: user.id,
              company_id: user.company?.id,
              label: user.company?.company_name
            }))
          );
        } else {
        }
      })
      .catch(error => {});
  }, []);
  useEffect(() => {
    if (company.value > 0) {
      setStartDate(getCurrentDayStartDateWithTimeInUtc());
      setEndDate(getCurrentDayEndDateWithTimeInUtc());

      getEventModalType(company.value)
        .then(response => {
          if (response && response.isSuccess) {
            let labelOptions = response.data.map(x => x);
            const labels = [];
            labelOptions.map((x, index) => {
              x.split(",").map(y => {
                labels.push({ label: y, value: y });
                return null;
              });
              return null;
            });
            if (labelOptions?.length === 0) {
              setLabelOptions([]);
            } else {
              setLabelOptions(labels);
            }
          } else throw new Error();
        })
        .catch(err => {
          if (err.detail) {
            warningToast(err.detail);
          } else {
            warningToast("Something went wrong");
          }
        });
      setSelectedLocationid([]);
      getEnabledLocationListResultManager(company.company_id)
        .then(response => {
          // eslint-disable-next-line
          if (response && response.data) {
            const locationOptions = response.data.map(c => ({
              label: c.location_name,
              value: c.id
            }));
            setLocationOptions(locationOptions);
          } else throw new Error();
        })
        .catch(err => {
          if (err.detail) {
            warningToast(err.detail);
          } else {
            warningToast("Something went wrong");
          }
        });
    }
    if(company.value) {
      getResultManagerTotalCameras(company.value, selectedLocationid)
          .then((response) => {
            if (response && response.isSuccess) {
              const cameraOptions = response.data.map((c) => ({
                label: c.camera_name,
                value: c.id,
              }));
              const obj = {};
              response.data.map((x) => {
                obj[x.id] = x.camera_name;
                return null;
              });
              let cameraids = [];
              response.data.map((x) => {
                cameraids.push(x.id.toString());
                return null;
              });
              setCamerasIds(obj);
              cameraOptions.map((c) => {
                return c.value;
              });
              setCameraOptions(cameraOptions);
              if(cameraOptions.length > 0){
                setSelctedcameraid(cameraids);
                setInitialCameras(cameraids);
              }else{
                setSelctedcameraid([]);
                setInitialCameras([]);
              }
            } else throw new Error();
          })
          .catch((err) => {
            if (err.detail) {
              warningToast(err.detail);
            } else {
              warningToast("Something went wrong");
            }
          });
    }
    // eslint-disable-next-line
  }, [company]);

  useEffect(() => {
    if (selectedLocationid.length > 0) {
      getResultManagerTotalCameras(company.value, selectedLocationid)
        .then(response => {
          if (response && response.isSuccess) {
            const cameraOptions = response.data.map(c => ({
              label: c.camera_name,
              value: c.id
            }));
            const obj = {};
            response.data.map(x => {
              obj[x.id] = x.camera_name;
              return null;
            });
            let cameraids = [];
            response.data.map((x) => {
              cameraids.push(x.id.toString());
              return null;
            });
            setCamerasIds(obj);
            cameraOptions.map(c => {
              return c.value;
            });
            setCameraOptions(cameraOptions);
            if(cameraOptions.length > 0){
              setSelctedcameraid(cameraids);
              setInitialCameras(cameraids);
            }else{
              warningToast("No Cameras Found For Location");
              setSelctedcameraid([]);
              setInitialCameras([]);
            }
          } else throw new Error();
        })
        .catch(err => {
          if (err.detail) {
            warningToast(err.detail);
          } else {
            warningToast("Something went wrong");
          }
        });
    }
  }, [selectedLocationid]);
  const handleStartDateChange = e => {
    if (e[0] && !e[1]) {
      let selected_day = e[0].day;
      let date_GMT =
        e[0].year +
        "-" +
        e[0].month.number +
        "-" +
        selected_day +
        " " +
        e[0].hour.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false
        }) +
        ":" +
        e[0].minute.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false
        });
      setStartDate(getUtcDateAndTimeFromCalendar(date_GMT));
      setEndDate(getCurrentDayEndDateWithTimeInUtc());
    } else if (e[1]) {
      //toggle startDate and endDate if startDate > endDate
      if (e[0]) {
        let selected_day = e[0].day;
        let date_GMT =
          e[0].year +
          "-" +
          e[0].month.number +
          "-" +
          selected_day +
          " " +
          e[0].hour.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false
          }) +
          ":" +
          e[0].minute.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false
          });
        setStartDate(getUtcDateAndTimeFromCalendar(date_GMT));
      }
      let selected_day = e[1].day;
      let date_GMT =
        e[1].year +
        "-" +
        e[1].month.number +
        "-" +
        selected_day +
        " " +
        e[1].hour.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false
        }) +
        ":" +
        e[1].minute.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false
        });
      setEndDate(getUtcDateAndTimeFromCalendar(date_GMT));
    } else {
      setStartDate(getCurrentDayStartDateWithTimeInUtc());
      setEndDate(getCurrentDayEndDateWithTimeInUtc());
    }
  };
  const handleCompanyChange = e => {
    if(e.value !== company.value) {
      setCompany(e);
      setCamera([]);
      setSelctedcameraid([]);
      setCameraOptions([]);
      setLocation(null);
      setLocationOptions([]);
      setSelectedLocationid([])

      setSelectedType([]);
      // setSelectedTypeArray([]);
      setStartDate(null);
      setEndDate(null);
      setValues(null);
      setLabelOptions([]);
      setIsLocationSelected(false);
    }
  };
  const handleLocationChange = e => {
    if(e?.value.toString() !== selectedLocationid[0]) {
      let locationids = [];
      locationids.push(e.value.toString());
      setSelectedLocationid(locationids);
      setSelctedcameraid([]);
      setCamera([])
      setLocation(e);
      setIsLocationSelected(true);
    }
  };

  const handleCameraChange = (selectedCamera)  => {
    setSelctedcameraid([])
    let cameraids = [];
    if (selectedCamera?.length > 0) {
      for (let i = 0; i < selectedCamera.length; i++) {
        cameraids.push(selectedCamera[i].value.toString());
      }
      setCamera(selectedCamera);
      setSelctedcameraid(cameraids);
    }else{
      setCamera([])
      setSelctedcameraid(initialCameras);
    }
  };

  // selectedTypeArray
  const handleTypeChange = selectedType => {
    setSelectedTypeArray([]);
    let selectedTypeArray = [];
    if (selectedType) {
      for (let i = 0; i < selectedType.length; i++) {
        selectedTypeArray.push(selectedType[i].value);
      }
    }
    setSelectedType(selectedType);
    setSelectedTypeArray(selectedTypeArray);
  };

  const handleIsHideChange = e => {
    setSwitchToggle(!switchToggle);
    setIsHide(!switchToggle);
  };

  const handleIsDetectionChange = e => {
    setDetectionSwitchToggle(!detectionSwitchToggle);
    setIsDetection(!detectionSwitchToggle);
  };

  const handleIsViewAllChange = e => {
    setViewAllSwitchToggle(!viewAllSwitchToggle);
    setIsViewAll(!viewAllSwitchToggle);
  };

  const applyFilter =()=>{
    setApplyFlag(true)
    setShow(true)
  }

  return (
    <Card className="example example-compact" style={{ minHeight: "300px" }}>
      <CardBody style={{ minHeight: "300px", padding: "10px 10px" }}>
        <Row>
          <Col xl={8} xs={12} md={7}>
            <CardHeader title="Events" />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xl={4} xs={12} md={4} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Select
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82"
                  }
                })}
                name="companyList"
                className="select-react-dropdown"
                isSearchable={false}
                options={companyOptions}
                onChange={opt => handleCompanyChange(opt)}
                value={company}
              />
            </Form.Group>
          </Col>
          <Col xl={4} xs={12} md={4} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Select
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82"
                  }
                })}
                name="locationOptions"
                isSearchable={false}
                placeholder="Select Location"
                className="select-react-dropdown"
                options={locationOptions}
                onChange={opt => handleLocationChange(opt)}
                value={location}
              />
            </Form.Group>
          </Col>
          <Col xl={4} xs={12} md={4} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Camera</Form.Label>
              <Select
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82"
                  }
                })}
                name="cameraOptions"
                isSearchable={false}
                placeholder="Select Camera"
                className="select-react-dropdown"
                isMulti={true}
                options={cameraOptions}
                onChange={(opt) => {
                  setShow(false);
                  handleCameraChange(opt)
                }}
                value={camera}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xl={4} xs={12} md={4} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Select
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82"
                  }
                })}
                isSearchable={false}
                className="select-react-dropdown"
                isMulti={true}
                placeholder="Select Type"
                value={selectedType}
                onChange={s => {
                  setShow(false);
                  handleTypeChange(s);
                }}
                options={labelOptions}
              />
            </Form.Group>
          </Col>
          <Col xl={4} xs={12} md={4} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <DatePicker
                style={{
                  border: "1px solid hsl(0,0%,80%)",
                  minHeight: "40px"
                }}
                placeholder="Select Date Range"
                className="teal filterDateWidth"
                format="MM/DD/YYYY HH:mm A"
                range
                value={values}
                onChange={e => {
                  setValues(e);
                  handleStartDateChange(e);
                }}
                plugins={[
                  <TimePicker position="bottom" hideSeconds />,
                  <DatePanel markFocused />
                ]}
              />
            </Form.Group>
          </Col>
          <Col xl={1} xs={4} md={4}>
            <Form.Group className="mb-3">
              <Form.Label>View All?</Form.Label>
              <br />
              <Switch
                color="primary"
                checked={viewAllSwitchToggle}
                onChange={e => {
                  handleIsViewAllChange(e);
                }}
                // disabled={true}
                name="isViewAllStatus"
              />
            </Form.Group>
          </Col>
          <Col xl={1} xs={4} md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="ml-2">Hide?</Form.Label>
              <br />
              <Switch
                color="primary"
                checked={switchToggle}
                onChange={e => {
                  handleIsHideChange(e);
                }}
                disabled={isViewAll}
                name="isHideStatus"
              />
            </Form.Group>
          </Col>
          <Col xl={1} xs={4} md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Detection?</Form.Label>
              <br />
              <Switch
                color="primary"
                checked={detectionSwitchToggle}
                onChange={e => {
                  handleIsDetectionChange(e);
                }}
                // disabled={isViewAll}
                disabled={true}
                name="isDetectionStatus"
              />
            </Form.Group>
          </Col>
          <Col xl={1} xs={4} md={4}>
            <Button
                className={"mt-xl-5 mt-sm-3 mb-sm-3 btn btn-elevate "}
                onClick={applyFilter}
            >
              Apply Filter
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {show && (
              <MyEventViewTable
                  cameraOptions={cameraOptions}
                labelname={camerasIds}
                startDate={startDate}
                endDate={endDate}
                // selectedType={typeValue}
                selectedType={selectedTypeArray}
                userId={company.value}
                cameraId={selectedcameraid}
                isHide={isHide}
                isDetection={isDetection}
                isViewAll={isViewAll}
                isLocationSelected={isLocationSelected}
                  setApplyFlag={setApplyFlag}
                  applyFlag={applyFlag}
              />
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
