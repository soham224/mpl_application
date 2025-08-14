import React, {useEffect, useState} from 'react';
import {Card, CardBody} from "reactstrap";
import moment from "moment/moment";
import {getCurrentEndDate, getCurrentStartDate} from "../../../utils/TimeZone";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {getEnabledLocationList} from "../../Admin/modules/AddSupervisor/_redux";
import {warningToast} from "../../../utils/ToastMessage";
import {getTotalCamerasByLocationId} from "../../Admin/modules/DashboardGraph/_redux";
import {
    getAdminTotalCameras,
    getAllLabelsFromListOfCameraId
} from "../../Admin/modules/Subscriptions/_redux/DeployedRTSPJobs/DeployedRTSPJobsApi";
import getSelectedDateTimeDefaultValue from "../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../utils/dateRangePicker/dateRangeFunctions";
import {
    Button,
    Col,
    Form, Modal,
    OverlayTrigger,
    Row,
    Tooltip
} from "react-bootstrap";
import Select from "react-select";
import FormDateRangePicker from "../../../utils/dateRangePicker/FormDateRangePicker";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import {
    headerSortingClasses,
    NoRecordsFoundMessage,
    PleaseWaitMessage, sortCaret
} from "../../../_metronic/_helpers";
import {getResultMetadata, getResults} from "../../Admin/modules/MyResults/_redux/MyResultApi";
import * as columnFormatters
    from "../../Admin/modules/MyResults/components/DeployedRTSPJobs/MyResultTable/my-result-table/column-formatters";
import * as actions from "../../Admin/modules/MyResults/_redux/MyResultAction";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
    MyResultViewDialog
} from "../../SuperAdmin/modules/MyResult/MyResultTable/my-result-view-dialog/MyResultViewDialog";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Boundingbox from "image-bounding-box-custom";

let currentPage;

function AiResult(props) {
    const dispatch = useDispatch();
    const initJob = { label: "Select Model", value: 0 };
    const [rtspJobModel, setRTSPJobModel] = useState(initJob);
    const [tableData, setTableData] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState([
        { label: "All Location", value: "-1" }
    ]);
    const [selectedCurrentLocationOptions, setSelectedCurrentLocationOptions] = useState([]);
    const [location_list, setLocation_list] = useState(["-1"]);
    const [selectedLoctionArray, setSelectedLoctionArray] = useState(["-1"]);


    const [camera, setCamera] = useState([{ label: "All Camera", value: "-1" }]);
    const [cameraOptions, setCameraOptions] = useState([]);
    const [camerasIds, setCamerasIds] = useState(null);
    const [cameraLoading, setCameraLoading] = useState(false);
    const [selctedCameraId, setSelctedCameraId] = useState(["-1"]);



    const [selectedLabel, setSelectedLabel] = useState([
        { label: "All label", value: "-1" }
    ]);
    const [labelOptions, setLabelOptions] = useState([]);
    const [labelLoading, setLabelLoading] = useState(false);
    const [selectedLabelArray, setSelectedLabelArray] = useState(["-1"]);




    const [selectedIndex, setSelectedIndex] = useState(12);
    const [startDate, setStartDate] = useState(
        moment.utc(getCurrentStartDate()).format()
    );
    const [endDate, setEndDate] = useState(
        moment.utc(getCurrentEndDate()).format()
    );
    const [minDate, setMinDate] = useState(new Date());
    const [maxDate, setMaxDate] = useState();
    const [show, setShow] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    const [currentItems, setCurrentItems] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    const { userRole,popupData  } = useSelector(
        ({ auth ,location }) => ({
            userRole: auth.user?.roles?.length && auth.user.roles[0]?.role,
            popupData: location?.popupData,
        }),
        shallowEqual
    );
    const { currentState } = useSelector(
        state => ({ currentState: state.myResult }),
        shallowEqual
    );

    const { refreshResult } = currentState;
    const [selectedRow, setSelectedRow] = useState(null);
    const [viewShow, setViewShow] = useState(false);

    const openViewMyResultDialog = (id, row, cameraName) => {
        setViewShow(true);
        setSelectedRow({ id, row, cameraName });
    };

    const onHideView = () =>{
        setViewShow(false);
    }


    const columns = [
        {
            dataField: "idx",
            text: "Index",
            sort: true,
            style: { minWidth: "165px" }
        },
        {
            dataField: "camera_name",
            text: "Camera Name",
            sort: true,
            formatter: (_, row) => camerasIds[parseInt(row?.camera_id)],
            headerSortingClasses,
            style: { minWidth: "55px" }
        },
        {
            dataField: "count",
            text: "Count",
            sort: true,
            formatter: (_, row) => row?.result?.detection?.length || 0
        },
        {
            dataField: "created_date.$date",
            text: "Created Date",
            sort: true,
            sortCaret: sortCaret,
            headerSortingClasses,
            formatter: (_, row) =>
                moment
                    .utc(row?.created_date?.$date) // Added optional chaining to prevent errors
                    .local()
                    .format("MMMM DD YYYY, h:mm:ss a"),
            style: { minWidth: "165px" }
        },
        {
            dataField: "labels",
            text: "Labels",
            sort: true,
            formatter: (_, row) => Object.keys(row?.counts || {}).toString()
        },
        {
            dataField: "action",
            text: "Actions",
            formatter: (_, row) => (  // ✅ Fixed Syntax Here

                <>
                    <a
                    title="Information"
                    className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
                    onClick={() => openViewMyResultDialog(row._id?.$oid, row,  camerasIds)}
                >
                <span className="svg-icon svg-icon-md svg-icon-light-inverse">
                    <VisibilityIcon
                        color="action"
                        style={{ fontSize: "2rem", color: "#147b82" }}
                    />
                </span>
                </a>
                    </>
            ),
            style: { minWidth: "164px" }
        }
    ];





    useEffect(() => {
        getEnabledLocationList(userRole)
            .then(response => {
                // eslint-disable-next-line
                if (response && response.data) {
                    let locationOptions = [];
                    response.data.map(obj =>
                        locationOptions.push({ label: obj.location_name, value: obj.id })
                    );
                    locationOptions.push({ label: "All Location", value: "-1" });
                    setSelectedCurrentLocationOptions(locationOptions);
                }
            })
            .catch(error => {
                if (error.detail) {
                    warningToast(error.detail);
                } else {
                    warningToast("Something went Wrong");
                }
            });
    }, []);

    useEffect(() => {
        getAllLocations();
    }, [location_list, selectedLocation]);

    useEffect(() => {
        setCameraLoading(true);
        setLabelLoading(true);
        getAdminTotalCameras(userRole)
            .then(response => {
                if (response && response.isSuccess) {
                    const cameraOptions = response.data.map(c => ({
                        label: c.camera_name,
                        value: c.id
                    }));
                    cameraOptions.push({ label: "All Camera", value: "-1" });
                    setCameraOptions(cameraOptions);

                    const objects = {};
                    response.data.map(x => {
                        objects[x.id] = x.camera_name;
                        return null;
                    });
                    setCamerasIds(objects);
                    setCameraLoading(false);
                } else throw new Error();
            })
            .catch(err => {
                setCameraLoading(false);
                if (err.detail) {
                    warningToast(err.detail);
                } else {
                    warningToast("Something went wrong");
                }
            });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        let data = {
            camera_id: selctedCameraId,
            location_id: location_list
        };
        if (camera === null || camera.length === 0) {
            setSelectedLabel(null);
        } else {
            setSelectedLabel([{ label: "All label", value: "-1" }]);
        }
        getAllLabelsFromListOfCameraId(data, userRole)
            .then(response => {
                if (response && response.isSuccess) {
                    const labelOptions = response.data.map(x => x.labels);
                    let labels = [];
                    let finale_labels = [];
                    labelOptions.map((item, index) => {
                        let arr = item.split(",");
                        arr.map(x => {
                            labels.push(x);
                            return null;
                        });
                        return null;
                    });
                    let uniqueLabels = Array.from(new Set(labels));
                    uniqueLabels.map(x => finale_labels.push({ label: x, value: x }));
                    finale_labels.push({ label: "All Label", value: "-1" });
                    setStartDate(startDate);
                    setEndDate(endDate);
                    setLabelLoading(false);
                    if (labelOptions?.length === 0) {
                        setLabelOptions([]);
                    } else {
                        setLabelOptions(finale_labels);
                    }
                } else throw new Error();
            })
            .catch(err => {
                setLabelLoading(false);
                if (err.detail) {
                    warningToast(err.detail);
                } else {
                    warningToast("Something went wrong");
                }
            });
    }, [selctedCameraId, location_list]);


    useEffect(() => {
        if ((startDate && endDate) || selectedLabelArray || selctedCameraId) {
            getMyResultMetadata(
                startDate,
                endDate,
                selectedLabelArray,
                selctedCameraId,
                pageSize
            );
        }
    }, []);

    useEffect(() => {
        if(show){
            if ((startDate && endDate) || selectedLabelArray || selctedCameraId) {
                getMyResultMetadata(
                    startDate,
                    endDate,
                    selectedLabelArray,
                    selctedCameraId,
                    pageSize
                );
            }
        }

    }, [show ,pageSize]);





    function getMyResultMetadata(
        startDate,
        endDate,
        selectedLabelArray,
        selctedCameraId,
        pageSize
    ) {
        setListLoading(true);
        currentPage = 0;
        if (startDate && endDate) {
            getResultMetadata(
                startDate,
                endDate,
                selectedLabelArray,
                selctedCameraId,
                location_list,
                pageSize
            )
                .then(response => {
                    if (response && response.isSuccess) {
                        // setPageNumber()
                        setPageSize(response.data.page_size);
                        setTotalPages(response.data.total_pages);
                        setTotalCount(response.data.total_count);
                        getMyResults((currentPage = 1), response.data.page_size);
                    } else throw new Error();
                })
                .catch(error => {
                    if (error.detail) {
                        setListLoading(false);
                        warningToast(error.detail);
                    } else {
                        warningToast("Something went Wrong");
                    }
                });
        }
    }

    useEffect(() => {
        console.log("refreshResult" ,currentState,refreshResult ,startDate && endDate ,startDate , endDate)
        if (startDate && endDate) {
            getMyResults(pageNumber, pageSize);
        }
        // eslint-disable-next-line
    }, [pageNumber , pageSize, refreshResult]);

    function getMyResults(pageNo, pageSize) {
        setListLoading(true);
        getResults(
            pageSize,
            pageNo,
            rtspJobModel.value,
            startDate,
            endDate,
            selctedCameraId,
            selectedLabelArray,
            location_list
        )
            .then(response => {
                if (response && response.isSuccess) {
                    setCurrentItems(response.data);
                    dispatch(actions.setMyResults(response.data));
                    currentPage = pageNo;
                    setListLoading(false);
                    if (response.data.length > 0) {
                        setTableData(true);
                    } else {
                        setTableData(false);
                    }
                } else throw new Error();
            })
            .catch(err => {
                if (err.detail) {
                    setListLoading(false);
                    warningToast(err.detail);
                } else {
                    warningToast("Something went wrong");
                }
            });
    }



    const getAllLocations = () => {
        if (selectedLocation === null || selectedLocation.length === 0) {
            setCamera(null);
            setSelectedLabel(null);
        } else {
            setCamera([{ label: "All Camera", value: "-1" }]);
            setSelectedLabel([{ label: "All label", value: "-1" }]);
        }

        getTotalCamerasByLocationId(location_list).then(response => {
            if (response && response.isSuccess) {
                const cameraOptions = response.data.map(c => ({
                    label: c.camera_name,
                    value: c.id
                }));
                cameraOptions.push({ label: "All Camera", value: "-1" });
                setCameraOptions(cameraOptions);

                const objects = {};
                response.data.map(x => {
                    objects[x.id] = x.camera_name;
                    return null;
                });
                setCamerasIds(objects);
                setCameraLoading(false);
            } else throw new Error();
        });
    };


    const dateTimeRangeIndexChangeHandler = (rangeIndex, value) => {
        let dateVal = getSelectedDateTimeDefaultValue(value);
        let index = getSelectedDateTimeDefaultValueForRange(parseInt(dateVal, 10));
        // let reportFilterParameter = this.state.reportFilterParameter;
        let min = startDate;
        let max = endDate;
        let minDateNew = minDate;
        let maxDateNew = maxDate;
        if (parseInt(dateVal) === 12) {
            min = parseInt("defaultMin", 0);
            max = parseInt("defaultMax", 0);
            minDateNew = ["min"];
            maxDateNew = ["max"];
        }
        setSelectedIndex(index);
        setStartDate(min);
        setEndDate(max);
        setMinDate(minDateNew);
        setMaxDate(maxDateNew);
    };

    const dateTimeRangeChangeHandler = (startDate, endDate) => {
        setStartDate(moment.utc(startDate).format());
        setEndDate(moment.utc(endDate).format());
    };


    const handleLocationChange = selectedlocation => {

        if (selectedlocation === null || selectedlocation.length === 0) {
            setCamera(null);
            setSelectedLabel(null);
            setLocation_list(["-1"]);
            setSelectedLabelArray(["-1"]);
        } else {
            setCamera([{ label: "All Camera", value: "-1" }]);
            setSelectedLabel([{ label: "All label", value: "-1" }]);
            setSelctedCameraId(["-1"]);
            setSelectedLabelArray(["-1"]);
        }
        setSelectedLoctionArray([]);
        let selectedLocationArray = [];
        if (selectedlocation) {
            for (let i = 0; i < selectedlocation.length; i++) {
                selectedLocationArray.push(selectedlocation[i].value.toString());

                let locationids = [];
                selectedlocation.map(x => {
                    locationids.push(x.value.toString());
                    return null;
                });
                setLocation_list(locationids);
            }
        }
        setSelectedLocation(selectedlocation);
        setSelectedLoctionArray(selectedLocationArray);
    };

    const handleLabelChange = selectedLabel => {
        setSelectedLabelArray([]);
        let selectedLabelArray = [];
        if (selectedLabel) {
            for (let i = 0; i < selectedLabel.length; i++) {
                selectedLabelArray.push(selectedLabel[i].value);
            }
        }
        setSelectedLabel(selectedLabel);
        setSelectedLabelArray(selectedLabelArray);
    };

    const handleCameraChange = e => {
        let selctedcamera = [];
        if (e) {
            e.map(x => {
                selctedcamera.push(x.label);
                setSelectedLabelArray(["-1"]);
                return null;
            });
            let cameraids = [];
            e.map(x => {
                cameraids.push(x.value.toString());
                setSelectedLabelArray(["-1"]);
                return null;
            });
            setSelctedCameraId(cameraids);
        } else {
            setSelctedCameraId([]);
            setSelectedLabelArray(["-1"]);
        }
        setCamera(e);
    };


    const applyFilter = () => {
        if (selectedLoctionArray.length === 0) {
            warningToast("Please Select Location");
        } else if (selctedCameraId.length === 0) {
            warningToast("Please Select Camera");
        } else if (selectedLabelArray.length === 0) {
            warningToast("Please Select Labels");
        } else {
            setShow(false);
            setTimeout(() => {
                setShow(true);
            }, 100);
        }
    };

    const clearFilter = () => {
        setLocation_list([-1]);
        setSelectedLabelArray(["-1"]);
        setSelctedCameraId(["-1"]);
        setShow(false);
        setSelectedLocation([{ label: "All Location", value: "-1" }]);
        setCamera({ label: "All Camera", value: "-1" });
        setSelectedLabel({ label: "All label", value: "-1" });
        setStartDate(moment.utc(getCurrentStartDate()).format());
        setEndDate(moment.utc(getCurrentEndDate()).format());
        setTimeout(() => {
            setShow(true);
        }, 100);
    };

    const paginationOptions = {
        page: pageNumber,
        sizePerPage: pageSize,
        totalSize: totalCount,
        showTotal: true,
        alwaysShowAllBtns: true,
        sizePerPageList: [
            {text: "5", value: 5},
            {text: "25", value: 25},
            {text: "50", value: 50},
            {text: "100", value: 100},
        ],
        onPageChange: (newPage) => setPageNumber(newPage),
        onSizePerPageChange: (newSize) => {
            setPageSize(newSize);
            setPageNumber(1); // Reset to page 1 when size changes
        },
    };


    return (
        <>
            <Card className="example example-compact"  style={{minHeight: "150px", overflow: "visible"}}>
                <CardBody style={{ padding: "10px 10px" }}>
                    <Row>
                        <Col xl={8} xs={12} md={7}>
                            <h3>My Result </h3>
                        </Col>
                    </Row>
                    <hr />

                    <Row className="">
                        <Col xl={2} xs={12} md={6} sm={12}>
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
                                    isSearchable={false}
                                    isMulti={true}
                                    placeholder="Select Location"
                                    className="select-react-dropdown"
                                    value={selectedLocation}
                                    onChange={handleLocationChange}
                                    options={selectedCurrentLocationOptions}
                                />
                            </Form.Group>
                        </Col>
                        <Col xl={2} xs={12} md={6} sm={12}>
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
                                    name="camera"
                                    isLoading={cameraLoading}
                                    isSearchable={false}
                                    className="select-react-dropdown"
                                    isMulti={true}
                                    placeholder="Select Camera"
                                    options={cameraOptions}
                                    onChange={c => {
                                        handleCameraChange(c);
                                    }}
                                    value={camera}
                                />
                            </Form.Group>
                        </Col>
                        <Col xl={2} xs={12} md={6} sm={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-4">Select Label</Form.Label>
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
                                    isSearchable={false}
                                    isLoading={labelLoading}
                                    className="select-react-dropdown"
                                    isMulti={true}
                                    placeholder="Select Label"
                                    value={selectedLabel}
                                    onChange={s => {
                                        handleLabelChange(s);
                                    }}
                                    options={labelOptions}
                                />
                            </Form.Group>
                        </Col>
                        <Col xl={4} xs={12} md={6} sm={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-4">Select Date Range</Form.Label>
                                <FormDateRangePicker
                                    rangeIndex={selectedIndex}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    startDate={startDate}
                                    endDate={endDate}
                                    changeDateTimeRange={dateTimeRangeChangeHandler}
                                    changeDateTimeRangeIndex={dateTimeRangeIndexChangeHandler}
                                />
                            </Form.Group>
                        </Col>
                        <Col xl={2} xs={12} md={12} sm={12}>
                            <div className={"d-flex mr-2 mt-5"}>
                                <Button
                                    style={{ paddingLeft: "8px", paddingRight: "10px" }}
                                    className={"mt-5 btn-apply-filter"}
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
                                        className="btn btn-light btn-elevate mt-5 ml-5"
                                    >
                                        Reset filter
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </Col>
                    </Row>

                    <div>
                        {/*{tableData && show && camerasIds && (*/}
                        {/*{tableData && show && camerasIds && (*/}
                            <>
                                {/*<BlockUi tag="div" blocking={listLoading} color="#014f9f">*/}
                                    {currentItems.length > 0 ?
                                        <BootstrapTable
                                            wrapperClasses="table-responsive"
                                            bordered={false}
                                            bootstrap4
                                            remote
                                            keyField="id"
                                            data={currentItems}
                                            columns={columns}
                                            pagination={paginationFactory(paginationOptions)}
                                        >
                                            <PleaseWaitMessage entities={currentItems}/>
                                            <NoRecordsFoundMessage entities={currentItems}/>
                                        </BootstrapTable> :
                                        <>
                                            <hr/>
                                            <div className={ 'h3 d-flex justify-content-center align-items-center'}>
                                                No Data Found
                                            </div>
                                        </>
                                    }

                                {/*</BlockUi>*/}
                            </>
                        {/*)}*/}
                    </div>

                </CardBody>
            </Card>


            <Modal
                show={viewShow}
                onHide={onHideView}
                dialogClassName="result-modal"
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        My Result Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TransformWrapper
                        defaultScale={1}
                        defaultPositionX={200}
                        defaultPositionY={100}
                    >
                        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                            <React.Fragment>
                                <div
                                    className="tools text-right"
                                    style={{ width: "100%", marginBottom: "4px" }}
                                >
                                    <ButtonGroup
                                        size="small"
                                        aria-label="Small outlined button group"
                                    >
                                        <Button onClick={zoomIn}>+</Button>
                                        <Button onClick={zoomOut}>-</Button>
                                        <Button onClick={resetTransform}>reset</Button>
                                    </ButtonGroup>
                                </div>
                                <div
                                    className="boundimage-full w-100"
                                    style={{ margin: "0 auto" }}
                                >

                                    {console.log("selectedRow",selectedRow)}
                                    <TransformComponent>
                                        <Boundingbox
                                            className="row m-auto col-12 p-0 text-center"
                                            image={selectedRow?.row?.image_url}
                                            boxes={selectedRow?.row?.result?.detection.map(d => ({
                                                coord: [
                                                    d.location[0],
                                                    d.location[1],
                                                    d.location[2] - d.location[0],
                                                    d.location[3] - d.location[1]
                                                ],
                                                label: d.label
                                            }))}
                                            options={boundBoxOptions}
                                        />
                                    </TransformComponent>
                                </div>
                            </React.Fragment>
                        )}
                    </TransformWrapper>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        onClick={onHideView}
                        className="btn btn-light btn-elevate"
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>


        </>
    );
}

export default AiResult;
const boundBoxOptions = {
    colors: {
        normal: "red",
        selected: "red",
        unselected: "red"
    },
    style: {
        maxWidth: "100%",
        maxHeight: "90vh",
        margin: "auto"
    }
};