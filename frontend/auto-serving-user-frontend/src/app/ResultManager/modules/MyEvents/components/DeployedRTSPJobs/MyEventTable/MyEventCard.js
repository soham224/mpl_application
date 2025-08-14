import React, {useEffect, useState} from "react";
import {Card, CardBody,} from "../../../../../../../_metronic/_partials/controls";
import CardHeader from "@material-ui/core/CardHeader";
import {MyEventTable} from "./my-event-table/MyEventsTable";
import Select from "react-select";
import {Button, Col, Form, Row} from "react-bootstrap";
import {getAllLabelsFromUserId} from "../../../../../../Admin/modules/Subscriptions/_redux/DeployedRTSPJobs/DeployedRTSPJobsApi";
import {getEnabledLocationListEventManager, getEventManagerTotalCameras} from "../../../_redux/MyEventApi";
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
    getUtcDateAndTimeFromCalendar,
} from "../../../../../../../utils/TimeZone";
import {getResultManagerTotalCameras} from "../../../../MyResults/_redux/MyResultApi";

export function MyEventCard() {
    const initCompany = {label: "Select Company",value: 0};
    const [company, setCompany] = useState(initCompany);
    const [camera, setCamera] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [values, setValues] = useState([startDate, endDate]);
    const [show, setShow] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState([]);
    const [selectedLabelArray, setSelectedLabelArray] = useState([]);
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
    const [userId, setUserId] = useState(null)
    const [originalCompanyId, setOriginalCompanyId] = useState(null)
    const [applyFlag, setApplyFlag] = useState(false)

    const {userRole} = useSelector(
        ({auth}) => ({
            userRole: auth.user?.roles?.length && auth.user.roles[0]?.role,
            user: auth?.user,
        }),
        shallowEqual
    );

    useEffect(() => {
        getAllUsersResultManager()
            .then((response) => {
                if (response && response.isSuccess) {
                    setCompanyOptions(
                        response.data.map((user) => ({
                            value: user.id,
                            company_id: user.company?.id,
                            label: user.company?.company_name,
                        }))
                    );
                } else {
                }
            })
            .catch((error) => {
            });
    }, []);
    useEffect(() => {
        if (company.value > 0) {
            setStartDate(getCurrentDayStartDateWithTimeInUtc());
            setEndDate(getCurrentDayEndDateWithTimeInUtc());
            setUserId(company.value)
            setSelectedLocationid([]);
            getAllLabelsFromUserId(company.value, userRole)
                .then((response) => {
                    if (response && response.isSuccess) {
                        let labelOptions = response.data.map((x) => x);
                        const labels = [];
                        labelOptions.map((x, index) => {
                            x.split(",").map((y) => {
                                labels.push({label: y, value: y});
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
                .catch((err) => {
                    if (err.detail) {
                        warningToast(err.detail);
                    } else {
                        warningToast("Something went wrong");
                    }
                });
            setOriginalCompanyId(company.company_id)
            getEnabledLocationListEventManager(company.company_id)
                .then((response) => {
                    if (response && response.data) {
                        const locationOptions = response.data.map((c) => ({
                            label: c.location_name,
                            value: c.id,
                        }));
                        setLocationOptions(locationOptions);
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
                        setSelctedcameraid(cameraids);
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
    }, [company]);

    useEffect(() => {
        if (selectedLocationid.length > 0) {
            getEventManagerTotalCameras(company.value, selectedLocationid)
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
                            warningToast("No Cameras Found For Location");
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
    }, [selectedLocationid]);

    const handleStartDateChange = (e) => {
        if (e[0] && !e[1]) {
            // setShow(true);
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
                    useGrouping: false,
                }) +
                ":" +
                e[0].minute.toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
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
                        useGrouping: false,
                    }) +
                    ":" +
                    e[0].minute.toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
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
                    useGrouping: false,
                }) +
                ":" +
                e[1].minute.toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                });
            setEndDate(getUtcDateAndTimeFromCalendar(date_GMT));
            setShow(false);
        } else {
            setStartDate(getCurrentDayStartDateWithTimeInUtc());
            setEndDate(getCurrentDayEndDateWithTimeInUtc());
        }
       // cf(true);
    };

    const handleCompanyChange = (e) => {
        if(e.value !== company.value) {
            setCompany(e);
            setCamera([]);
            setSelctedcameraid([]);
            setCameraOptions([]);
            setLocation(null);
            setSelectedLocationid([])
            setLocationOptions([]);
            setSelectedLabel([]);
            setSelectedLabelArray([]);
            setStartDate(null);
            setEndDate(null);
            setValues(null);
            setLabelOptions([]);
            // setShow(true);
            setIsLocationSelected(false);
        }
    };

    const handleLocationChange = (e) => {
        if(e?.value.toString() !== selectedLocationid[0]) {
            let locationids = [];
            locationids.push(e.value.toString());
            setSelectedLocationid(locationids);
            setSelctedcameraid([]);
            setCamera([])
            setLocation(e);
           // setShow(true);
            setIsLocationSelected(true);
        }
    };

    const handleCameraChange = (selectedCamera) => {
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
       // setShow(true);
    };

    const handleLabelChange = (selectedLabel) => {
        setSelectedLabelArray([]);
        let selectedLabelArray = [];
        if (selectedLabel) {
            for (let i = 0; i < selectedLabel.length; i++) {
                selectedLabelArray.push(selectedLabel[i].value);
            }
        }
        setSelectedLabel(selectedLabel);
        setSelectedLabelArray(selectedLabelArray);
        //setShow(true);
    };
    const handleIsHideChange = (e) => {
        setSwitchToggle(!switchToggle);
        setIsHide(!switchToggle);
        //   setShow(true);
    };

    const handleIsDetectionChange = (e) => {
        setDetectionSwitchToggle(!detectionSwitchToggle);
        setIsDetection(!detectionSwitchToggle);
        setShow(true);
    };

    const handleIsViewAllChange = (e) => {
        setViewAllSwitchToggle(!viewAllSwitchToggle);
        setIsViewAll(!viewAllSwitchToggle);
        //setShow(true);
    };

    const applyFilter =()=>{
        setApplyFlag(true)
        setShow(true)
    }


    return (
        <Card className="example example-compact" style={{minHeight: "300px"}}>
            <CardBody style={{minHeight: "300px", padding: "10px 10px"}}>
                <Row>
                    <Col xl={8} xs={12} md={7}>
                        <CardHeader title="Events"/>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col xl={4} xs={12} md={4} sm={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company</Form.Label>
                            <Select
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: "#5DBFC4",
                                        primary: "#147b82",
                                    },
                                })}
                                name="companyList"
                                className="select-react-dropdown"
                                isSearchable={false}
                                options={companyOptions}
                                onChange={(opt) => handleCompanyChange(opt)}
                                value={company}
                            />
                        </Form.Group>
                    </Col>
                    <Col xl={4} xs={12} md={4} sm={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Select
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: "#5DBFC4",
                                        primary: "#147b82",
                                    },
                                })}
                                name="locationOptions"
                                isSearchable={false}
                                placeholder="Select Location"
                                className="select-react-dropdown"
                                options={locationOptions}
                                onChange={(opt) => handleLocationChange(opt)}
                                value={location}
                            />
                        </Form.Group>
                    </Col>
                    <Col xl={4} xs={12} md={4} sm={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Camera</Form.Label>
                            <Select
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: "#5DBFC4",
                                        primary: "#147b82",
                                    },
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
                            <Form.Label>Labels</Form.Label>
                            <Select
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: "#5DBFC4",
                                        primary: "#147b82",
                                    },
                                })}
                                isSearchable={false}
                                className="select-react-dropdown"
                                isMulti={true}
                                placeholder="Select Label"
                                value={selectedLabel}
                                onChange={(s) => {
                                    setShow(false);
                                    handleLabelChange(s);
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
                                    minHeight: "40px",
                                }}
                                placeholder="Select Date Range"
                                className="teal filterDateWidth"
                                format="MM/DD/YYYY HH:mm A"
                                range
                                value={values}
                                onChange={(e) => {
                                    setValues(e);
                                    handleStartDateChange(e);
                                }}
                                plugins={[
                                    <TimePicker position="bottom" hideSeconds/>,
                                    <DatePanel markFocused/>,
                                ]}
                            />
                        </Form.Group>
                    </Col>
                    <Col xl={1} xs={4} md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>View All?</Form.Label>
                            <br/>
                            <Switch
                                color="primary"
                                checked={viewAllSwitchToggle}
                                onChange={(e) => {
                                    handleIsViewAllChange(e);
                                }}
                                name="isViewAllStatus"
                            />
                        </Form.Group>
                    </Col>
                    <Col xl={1} xs={4} md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="ml-2">Hide?</Form.Label>
                            <br/>
                            <Switch
                                color="primary"
                                checked={switchToggle}
                                onChange={(e) => {
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
                            <br/>
                            <Switch
                                color="primary"
                                checked={detectionSwitchToggle}
                                onChange={(e) => {
                                    handleIsDetectionChange(e);
                                }}
                                disabled={isViewAll}
                                name="isDetectionStatus"
                            />
                        </Form.Group>
                    </Col>
                    <Col xl={1} xs={4} md={4}>
                        <Button
                            onClick={applyFilter}
                            className={"mt-5 btn btn-elevate "}
                        >
                            Apply
                        </Button>
                    </Col>
                        {/*<Form.Group className="mb-3">*/}
                        {/*    <Form.Label>Detection?</Form.Label>*/}
                        {/*    <br/>*/}
                        {/*    <Switch*/}
                        {/*        color="primary"*/}
                        {/*        checked={detectionSwitchToggle}*/}
                        {/*        onChange={(e) => {*/}
                        {/*            handleIsDetectionChange(e);*/}
                        {/*        }}*/}
                        {/*        disabled={isViewAll}*/}
                        {/*        name="isDetectionStatus"*/}
                        {/*    />*/}
                        {/*</Form.Group>*/}

                </Row>
                <Row>
                    <Col>
                        {show && (
                            <MyEventTable
                                originalCompanyId={originalCompanyId}
                                labelname={camerasIds}
                                startDate={startDate}
                                userId={userId}
                                endDate={endDate}
                                selectedLabel={selectedLabelArray}
                                companyId={company.value}
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
