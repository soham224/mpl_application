import React, {useEffect, useRef, useState} from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {Card, CardBody, Col, Row} from "reactstrap";
import CardHeader from "@material-ui/core/CardHeader";
import {SearchText} from "../../../../utils/SearchText";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import {ViewImageModal} from "./ViewImageModal";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import * as actions from "./_redux/AnprManagerAction";
import {warningToast} from "../../../../utils/ToastMessage";
import moment from "moment";
import {NoRecordsFoundMessage, PleaseWaitMessage} from "../../../../_metronic/_helpers";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {Button, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import Select from "react-select";
import {customStyles} from "../../../../utils/CustomStyles";
import FormDateRangePicker from "../../../../utils/dateRangePicker/FormDateRangePicker";
import getSelectedDateTimeDefaultValue from "../../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../../utils/dateRangePicker/dateRangeFunctions";
import {getCurrentEndDate, getCurrentStartDate} from "../../../../utils/TimeZone";
import {getTotalCamerasByLocationId} from "../DashboardGraph/_redux";
import FetchViolationModal from "../../../../utils/dateRangePicker/FetchViolationModal";
import * as action from "../Locations/_redux/LocationAction";


export default function AnprManagerViolation() {
    const dispatch = useDispatch();
    const searchInput = useRef("");

    const [loading, setLoading] = useState(false);
    const [viewModalShow, setViewModalShow] = useState(false);
    const [rowDriverImage, setRowDriverImage] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [fullViolationFullImage, setFullViolationFullImage] = useState("");
    const [plateViolationFullImage, setPlateViolationFullImage] = useState("");
    const [plate, setPlate] = useState("");
    const [speed, setSpeed] = useState("");

    const [cameraLoading, setCameraLoading] = useState(false);
    const [cameraOptions, setCameraOptions] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState([{label: "All Camera", value: '-1'}]);

    const [selectedSpeed, setSelectedSpeed] = useState([{label: "All Speeds", value: "all"}]);


    const [selectedIndex, setSelectedIndex] = useState(12);
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [startDate, setStartDate] = useState(
        moment.utc(getCurrentStartDate()).format()
    );
    const [endDate, setEndDate] = useState(
        moment.utc(getCurrentEndDate()).format()
    );

    const {getSpeedDetails ,popupData} = useSelector(
        (state) => ({
            getSpeedDetails: state.anprManager,
            popupData: state.location?.popupData,
        }),
        shallowEqual
    );

    const [filterEntities, setFilterEntities] = useState([]);
    const [showBarTable, setShowBarTable] = useState(false);

    const handleCloseModal = () =>{
        dispatch(action.clearPopupDataAction())
        setShowBarTable(false)
    }

    useEffect(() => {
        setShowBarTable(false)
        if(popupData.length > 0){
            setShowBarTable(true)
        }
    }, [popupData]);

    useEffect(() => {
        getTotalCamerasByLocationIds()
    }, []);


    // Fetch data when page or rowsPerPage changes
    useEffect(() => {
        setLoading(true);
        const data = {
            page_number: page,
            page_size: rowsPerPage,
            camera_id_list: selectedCamera.map(item => item.value),
            speed: selectedSpeed[0]?.value,
            start_date: startDate,
            end_date: endDate
        };
        dispatch(actions.getSpeedDetail(data))
            .then(() => setLoading(false)) // Stop loader on success
            .catch((error) => {
                setLoading(false); // Stop loader on error
                console.log("error>>>", error);
            });
    }, [page, rowsPerPage, dispatch]);

    useEffect(() => {
        if (getSpeedDetails?.getSpeedDetails && Object.keys(getSpeedDetails.getSpeedDetails).length > 0) {
            setFilterEntities(getSpeedDetails.getSpeedDetails.items);
            setRowsPerPage(getSpeedDetails.getSpeedDetails.page_info.page_size);
            setTotalCount(getSpeedDetails.getSpeedDetails.page_info.total_count);
        }
    }, [getSpeedDetails]);

    // Column definitions for react-bootstrap-table-next
    const columns = [
        {
            dataField: "index",
            text: "Index",
            formatter: (cell, row, rowIndex) => (
                <span>{(page - 1) * rowsPerPage + (rowIndex + 1)}</span>
            )
        },
        {
            dataField: "camera_name",
            text: "Camera",
            formatter: (cell, row) => <span>{row?.camera_details?.camera_name}</span>
        },
        {
            dataField: "direction",
            text: "Dir",
            formatter: (cell, row) => <span>{row?.direction}</span>
        },
        {
            dataField: "plate",
            text: "Plate",
            formatter: (cell, row) => <span>{row?.plate}</span>
        },
        {
            dataField: "plate_image",
            text: "Plate Img",
            formatter: (cell, row) => (
                <img src={row?.plate_image_url} alt="plate" width="100px" height="40px"/>
            )
        },
        {
            dataField: "plate_color",
            text: "Plate Color",
            formatter: (cell, row) => <span>{row?.plate_color}</span>
        },
        {
            dataField: "speed",
            text: "Speed",
            formatter: (cell, row) => (
                <span style={{
                    color: row?.speed >= 31 ? "red" : "black",
                    fontWeight: row?.speed >= 31 ? "bold" : "normal"
                }}>
                    {row?.speed}
        </span>
            )
        },

        // {
        //     dataField: "direction",
        //     text: "Direction",
        //     formatter: (cell, row) => <span>
        //         {row?.direction}
        //     </span>
        // },
        {
            dataField: "vehicle_color",
            text: "Vehicle Color",
            formatter: (cell, row) => <span>{row?.vehicle_color}</span>
        },
        {
            dataField: "owner_name",
            text: "Owner",
            formatter: (cell, row) => <span>{row?.owner_name}</span>
        },
        {
            dataField: "vehicle_identified",
            text: "Identified",
            formatter: (cell, row) => <span>{row?.vehicle_identified}</span>
        },
        {
            dataField: "vehicle_type",
            text: "Vehicle Type",
            formatter: (cell, row) => <span>{row?.vehicle_type}</span>
        },
        {
            dataField: "created_date",
            text: "Date",
            formatter: (cell, row) =>
                moment(row?.time_msec)
                    .tz("Asia/Kolkata") // Convert to IST
                    .format("DD MMMM YYYY, HH:mm:ss")

        },
        {
            dataField: "violation_pic",
            text: "View",
            formatter: (cell, row) => (
                <span className="svg-icon svg-icon-md svg-icon-light-inverse d-flex justify-content-center align-items-center">
            <VisibilityIcon
                style={{
                    fontSize: "2rem",
                    color: row?.speed >= 31 ? "red" : "#147b82",
                    cursor: "pointer",
                }}
                onClick={() => handleClickModal(row)}
            />
        </span>
            )
        }

    ];

    const handleClickModal = (row) => {
        setViewModalShow(true);
        setFullViolationFullImage(row?.full_image_url)
        setPlateViolationFullImage(row?.plate_image_url)
        setPlate(row?.plate)
        setSpeed(row?.speed)

        dispatch(actions.getVehicleDetailsByNumberPlates(row?.plate))
            .then((res) => {
                setRowDriverImage(res);
            })
            .catch((error) => {
                console.log("error>>>", error)
                warningToast("Something went Wrong");
            });
    };

    const anprViewsClose = () => {
        setFullViolationFullImage("")
        setPlateViolationFullImage("")
        setViewModalShow(false);
        setRowDriverImage(null);
    };

    // Pagination Options
    const paginationOptions = {
        page: page,
        sizePerPage: rowsPerPage,
        totalSize: totalCount,
        showTotal: true,
        alwaysShowAllBtns: true,
        sizePerPageList: [
            {text: "10", value: 10},
            {text: "25", value: 25},
            {text: "50", value: 50},
            {text: "100", value: 100},
        ],
        onPageChange: (newPage) => setPage(newPage),
        onSizePerPageChange: (newSize) => {
            setRowsPerPage(newSize);
            setPage(1); // Reset to page 1 when size changes
        },
    };
    const handleSearch = () => {
        setLoading(true);
        setPage(1); // Reset to first page when searching

        const searchTerm = searchInput.current.value.trim(); // Get and trim search text
        const data = {
            page_number: 1,
            page_size: rowsPerPage,
            camera_id_list: selectedCamera.map(item => item.value),
            speed: selectedSpeed.value ? selectedSpeed.value : selectedSpeed[0]?.value,
            start_date: startDate,
            end_date: endDate,
            ...(searchTerm && {search: searchTerm}) // Include only if searchTerm is not empty
        };

        dispatch(actions.getSpeedDetail(data))
            .then(() => setLoading(false)) // Stop loader on success
            .catch((error) => {
                setLoading(false); // Stop loader on error
                console.log("error>>>", error);
            });
    };


    const dateTimeRangeChangeHandler = (startDate, endDate) => {
        setStartDate(moment.utc(startDate).format())
        setEndDate(moment.utc(endDate).format())
    };

    const dateTimeRangeIndexChangeHandler = (rangeIndex, value) => {
        let dateVal = getSelectedDateTimeDefaultValue(value);
        let index = getSelectedDateTimeDefaultValueForRange(parseInt(dateVal, 10));
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
        setSelectedIndex(index)
        setStartDate(min)
        setEndDate(max)
        setMinDate(minDateNew)
        setMaxDate(maxDateNew)
    };

    const getTotalCamerasByLocationIds = () => {
        getTotalCamerasByLocationId(['-1'])
            .then(res => {
                if (res && res.isSuccess) {
                    let cameraOptions = [];

                    res.data.map((item, index) => {
                        cameraOptions.push({label: item.camera_name, value: item.id});
                        return null;
                    });
                    cameraOptions.push({label: "All Camera", value: '-1'});
                    setCameraOptions(cameraOptions);
                    setCameraLoading(false);
                } else {
                    this.setState({blocking: false});
                    warningToast("Something went wrong");
                }
            })
            .catch(error => {
                if (error.detail) {
                    warningToast(error.detail);
                } else {
                    warningToast("Something went Wrong");
                }
            });
    }


    const handleCameraChange = (selectedOptions) => {
        setSelectedCamera(selectedOptions);
    };

    const handleSpeedChange = (speedOption) => {
        setSelectedSpeed(speedOption);
    };

    const applyFilter = () => {
        setLoading(true);
        const data = {
            page_number: page,
            page_size: rowsPerPage,
            camera_id_list: selectedCamera.map(item => item.value),
            speed: selectedSpeed.value ? selectedSpeed.value : selectedSpeed[0]?.value,
            start_date: startDate,
            end_date: endDate
        };
        dispatch(actions.getSpeedDetail(data))
            .then(() => setLoading(false)) // Stop loader on success
            .catch((error) => {
                setLoading(false); // Stop loader on error
                console.log("error>>>", error);
            });
    }

    const clearFilter = () => {
        setSelectedCamera({label: "All Camera", value: '-1'})
        setSelectedSpeed({label: "All Speeds", value: "all"})
        setPage(1)
        setRowsPerPage(10)
        setStartDate(moment.utc(getCurrentStartDate()).format())
        setEndDate(moment.utc(getCurrentEndDate()).format())

        setLoading(true);
        const data = {
            page_number: 1,
            page_size: 10,
            camera_id_list: ['-1'],
            speed: "all",
            start_date: moment.utc(getCurrentStartDate()).format(),
            end_date: moment.utc(getCurrentEndDate()).format()
        };
        dispatch(actions.getSpeedDetail(data))
            .then(() => setLoading(false)) // Stop loader on success
            .catch((error) => {
                setLoading(false); // Stop loader on error
                console.log("error>>>", error);
            });
    }


    return (
        <>
            <Card className="example example-compact" style={{minHeight: "150px", overflow: "visible"}}>
                <CardBody style={{padding: "10px 10px"}}>
                    <Row>
                        <Col xl={9} xs={12} md={9}>
                            <CardHeader title="ANPR Violation"/>
                        </Col>
                        <Col xl={3} md={3} xs={12}>
                            <div className="mt-3">
                                <SearchText
                                    reference={searchInput}
                                    placeholder="Search For Number plate"
                                    onChangeHandler={handleSearch}
                                />
                            </div>
                        </Col>
                    </Row>
                    <hr/>

                    <Row className="space">
                        <Col xl={2} xs={12} md={6} sm={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-4">Select Camera</Form.Label>
                                <Select
                                    theme={theme => ({
                                        ...theme,
                                        borderRadius: 0,
                                        cursor: "pointer",
                                        colors: {
                                            ...theme.colors,
                                            primary25: "#5DBFC4",
                                            primary: "#147b82"
                                        }
                                    })}
                                    isLoading={cameraLoading}
                                    isSearchable={true}
                                    isMulti={true}
                                    placeholder="Select Camera"
                                    className="select-react-dropdown"
                                    value={selectedCamera}
                                    onChange={handleCameraChange}
                                    options={cameraOptions}
                                    styles={customStyles}
                                />
                            </Form.Group>
                        </Col>
                        <Col xl={2} xs={12} md={6} sm={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-4">Select Speed</Form.Label>
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
                                    isMulti={false}
                                    styles={customStyles}
                                    isLoading={false}
                                    placeholder="Select Speed"
                                    value={selectedSpeed}
                                    onChange={handleSpeedChange}
                                    options={speedFilterOptions}
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
                                    changeDateTimeRangeIndex={
                                        dateTimeRangeIndexChangeHandler
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col xl={2} xs={12} md={12} sm={12}>
                            <div className={"d-flex mr-2 mt-5"}>
                                <Button
                                    style={{paddingLeft: "10px", paddingRight: "10px"}}
                                    // disabled={this.state.btndisabled}
                                    className={"mt-5 btn-apply-filter"}
                                    onClick={applyFilter}
                                    // size="lg"
                                >
                                    Apply Filter
                                </Button>

                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip id="user-notification-tooltip">
                                            Show Today Data
                                        </Tooltip>
                                    }
                                >
                                    <Button
                                        type="button"
                                        onClick={clearFilter}
                                        // size="lg"
                                        className="btn btn-light btn-elevate mt-5 ml-2"
                                    >
                                        Reset filter
                                    </Button>
                                </OverlayTrigger>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xl={8} lg={8} xs={12} md={7} sm={12}>
                            <div className="searchText">
                                <div className="row mb-5">

                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <BlockUi tag="div" blocking={loading} color="#014f9f">
                                {filterEntities.length > 0 ?
                                    <BootstrapTable
                                        wrapperClasses="table-responsive"
                                        bordered={false}
                                        bootstrap4
                                        remote
                                        keyField="id"
                                        data={filterEntities}
                                        columns={columns}
                                        pagination={paginationFactory(paginationOptions)}
                                    >
                                        <PleaseWaitMessage entities={filterEntities}/>
                                        <NoRecordsFoundMessage entities={filterEntities}/>
                                    </BootstrapTable> :
                                    <>
                                        <hr/>
                                        <div className={ 'h3 d-flex justify-content-center align-items-center'}>
                                            No Data Found
                                        </div>
                                    </>
                                }

                            </BlockUi>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <ViewImageModal
                viewModalShow={viewModalShow}
                anprViewsClose={anprViewsClose}
                rowDriverImage={rowDriverImage}
                fullViolationFullImage={fullViolationFullImage}
                plateViolationFullImage={plateViolationFullImage}
                plate={plate}
                speed={speed}
            />


            {showBarTable &&
                <FetchViolationModal
                    showBarTableData={showBarTable}
                    tableDatas={popupData}
                    handleCloseModal={handleCloseModal}
                />}
        </>
    );
}

export const speedFilterOptions = [
    {label: "31 or More", value: "above_31"},
    {label: "All Speeds", value: "all"},
    {label: "Below 30", value: "below_30"},
];



