import React, {Component} from "react";
import {toAbsoluteUrl} from "../../_helpers";
import DashboardGraph from "../../../app/Admin/modules/DashboardGraph/dashboardGraph";
import {Box, FormControl, InputLabel, Tab, Tabs} from "@material-ui/core";
import Select from "react-select";
import SVG from "react-inlinesvg";
import {Button, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import {
    getAllDeployedRTSPJobsDetails,
    getDiffEventsByCameraId,
    getFilterGraphData, getFilterResultOfAdminPercentage,
    getOneTableDataFromBar,
    getTotalCamerasByLocationId,
    getWidgetsDataForAdmin,
    getWidgetsDataForSupervisor
} from "../../../app/Admin/modules/DashboardGraph/_redux";
import {connect} from "react-redux";
import * as auth from "../../../app/Admin/modules/Auth";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import {warningToast} from "../../../utils/ToastMessage";
import DashboardTable from "../../../app/Admin/modules/DashboardGraph/dashboardTable";
import {ADMIN_ROLE, SUPERVISOR_ROLE} from "../../../enums/constant";
import {
    getCurrentDateAndTimeInIsoFormat,
    getCurrentEndDate,
    getCurrentStartDate
} from "../../../utils/TimeZone";
import moment from "moment";
import {withStyles} from "@material-ui/core/styles";
import {CardBody, Col, Row} from "reactstrap";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import FormDateRangePicker from "../../../utils/dateRangePicker/FormDateRangePicker";
import getSelectedDateTimeDefaultValue from "../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../utils/dateRangePicker/dateRangeFunctions";
import {getEnabledLocationList} from "../../../app/Admin/modules/AddSupervisor/_redux";
import {
    getAllLabelsFromListOfCameraId
} from "../../../app/Admin/modules/Subscriptions/_redux/DeployedRTSPJobs/DeployedRTSPJobsApi";
import DropDownMatrialUi from "./dropDownMatrialUi";
import {fetchData} from "../../../utils/FetchDataIneveryFiveMin";
// import MyChart from "./TopspinDashboardTwo";

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

const styles = theme => ({
    root: {
        width: "54px",
        height: "24px",
        padding: "0px"
    },
    switchBase: {
        color: "#818181",
        padding: "1px",
        "&$checked": {
            "& + $track": {
                backgroundColor: "#147b82"
            }
        }
    },
    thumb: {
        color: "white",
        width: "25px",
        height: "22px",
        margin: "0px"
    },
    track: {
        borderRadius: "20px",
        backgroundColor: "#147b82",
        opacity: "1 !important",
        "&:after, &:before": {
            color: "white",
            fontSize: "8px",
            fontWeight: "10px",
            position: "absolute",
            top: "7px"
        },
        "&:after": {
            content: "'LABEL'",
            left: "5px"
        },
        "&:before": {
            content: "'EVENT'",
            right: "2px"
        }
    },
    checked: {
        color: "#23bf58 !important",
        transform: "translateX(26px) !important"
    }
});

let now = new Date();
let start = moment(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
);
let end = moment(start)
    .add(1, "days")
    .subtract(1, "seconds");

class Demo2Dashboard extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            graphType: "column",
            graphDuration: "Monthly",
            modalOpen: false,
            showGraph: false,
            graphMessage: "No Data Found",
            widget: null,
            keys: [],
            title: [],
            widgeTitle: null,
            drilldownFromFun: false,
            startDateEndDateFlag: false,
            blocking: false,
            loadInitialGraphFlag: true,
            showBarTable: false,
            tableData: [],
            getTrue: false,
            cameraData: {},
            dashboardGraphName: "Label",
            currentTabOpenIndex: 0,
            startDate: getCurrentStartDate(),
            endDate: getCurrentEndDate(),
            minDate: "",
            maxDate: "",
            values: [],
            show: true,
            typeValue: 12,
            selectedIndex: 12,
            selectedDataSourceId: null,
            // notice: false,
            // allLabelFlag: false,

            locationLoading: false,
            locationOptions: [],
            selectedLocation: [],
            selectedLocationValue: ['-1'],

            totalCamerasByLocationLoading: false,
            cameraOptions: [],
            selectedCamera: [],
            selectedCameraValue: ['-1'],

            labelLoading: false,
            labelOptions: [],
            selectedLabel: [],
            selectedLabelValue: '-1',
            loadAlldata: false,
            topspinHighchartData: [],
            mainLoading: false,
            topspinFlag: false

        };
    }

    componentDidMount() {
        this.getAllLocations();
        fetchData();
        // this.getDataToPopulate();
        this.setState({
            allLabelFlag: true
        });
        const WidgetLabalAndValueParam = {
            start_date: this.state.startDate,
            end_date: this.state.endDate,
            current_date: getCurrentDateAndTimeInIsoFormat(),
            duration_type: "day",
            initial_graph: true,
            location_id: this.state.selectedLocationValue,
            camera_id: this.state.selectedCameraValue,
            selected_model_labels_list: this.state.selectedLabelValue,
        };

        this.setWidgetLabelAndValue(WidgetLabalAndValueParam);
        this.loadInitialGraph();
        let arr = {};
        getAllDeployedRTSPJobsDetails()
            .then(response => {
                if (response && response.isSuccess) {
                    response.data.map(job => {
                        job.deployment_job_rtsp_details.camera_settings.map(camera => {
                            arr[camera.id] = camera.camera_name;
                        });
                    });
                    this.setState({
                        cameraData: arr
                    });
                } else throw new Error();
            })
            .catch(err => {
                // warningToast('Something went wrong !');
                if (err.detail) {
                    warningToast("Data Not found for RTSP job");
                } else {
                    warningToast("Something went wrong");
                }
            });
    }

    setWidgetLabelAndValue = WidgetLabalAndValueParam => {
        const {user} = this.props;
        let userRole = user.roles[0].role;
        this.setState({
            widgetLoader: true
        });

        if (userRole === ADMIN_ROLE) {
            getWidgetsDataForAdmin(WidgetLabalAndValueParam)
                .then(response => {
                    let widgetData = response.data;
                    let arrayOrg = [];
                    Object.entries(widgetData).map(([key, value]) => {
                        arrayOrg.push(key);
                    });
                    let title = [];
                    let widgetFunData = this.formatWidgetData(arrayOrg, title);
                    this.setState({
                        widget: widgetData,
                        keys: widgetFunData.arrayData,
                        widgeTitle: widgetFunData.titleData,
                        widgetLoader: false
                    });
                })
                .catch(err => {
                    this.setState({
                        widgetLoader: false
                    });
                    warningToast("Something went wrong");
                });
        } else if (userRole === SUPERVISOR_ROLE) {
            this.setState({
                widgetLoader: true
            });
            getWidgetsDataForSupervisor(WidgetLabalAndValueParam)
                .then(response => {
                    let widgetData = response.data;
                    let arrayOrg = [];
                    Object.entries(widgetData).map(([key, value]) => {
                        arrayOrg.push(key);
                    });
                    let title = [];
                    let widgetFunData = this.formatWidgetData(arrayOrg, title);
                    this.setState({
                        widget: widgetData,
                        keys: widgetFunData.arrayData,
                        widgeTitle: widgetFunData.titleData,
                        widgetLoader: false
                    });
                })
                .catch(err => {
                    this.setState({
                        widgetLoader: false
                    });
                    warningToast("Something went wrong");
                });
        }
    };

    formatWidgetData = (arrayOrg, title) => {
        for (let i = 0; i < arrayOrg.length; i++) {
            let wordOne = arrayOrg[i];
            const words = wordOne.split("_");
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            }
            let joinedWord = words.join(" ");
            title.push(joinedWord);
        }
        return {titleData: title, arrayData: arrayOrg};
    };

    handleGraphChange = event => {
        this.setState({
            graphType: event.target.value
        });
    };

    loadInitialGraph = () => {
        this.setState(
            {
                setFilterParameters: false,
                loadInitialGraphFlag: true,
                showBarTable: false,
                graphType: "column",
                drilldownFromFun: false,
                parameters: {},
                notice: false

            },
            () => {
                this.setFilterParameters(
                    {
                        start_date: this.state.startDate,
                        end_date: this.state.endDate,
                        current_date: getCurrentDateAndTimeInIsoFormat(),
                        duration_type: "day",
                        initial_graph: true,
                        location_id: this.state.selectedLocationValue,
                        camera_id: this.state.selectedCameraValue,
                        selected_model_labels_list: this.state.selectedLabelValue,
                    },
                    "Today's " + this.state.dashboardGraphName + " Data Analysis",
                    false
                );

                if (this.props?.user?.user_email === 'topspin_admin@tusker.ai') {
                    this.setFIlterTopspinParameters(
                        {
                            start_date: this.state.startDate,
                            end_date: this.state.endDate,
                            current_date: getCurrentDateAndTimeInIsoFormat(),
                            duration_type: "day",
                            initial_graph: true,
                            location_id: this.state.selectedLocationValue,
                            camera_id: this.state.selectedCameraValue,
                            selected_model_labels_list: this.state.selectedLabelValue,
                        },
                        "Today's " + this.state.dashboardGraphName + " Data Analysis",
                        false
                    );
                }

            }
        );
    };

    loadAllYearData = () => {
        this.setState(
            {
                loadInitialGraphFlag: false,
                showBarTable: false,
                graphType: "column",
                drilldownFromFun: false,
                notice: false,
                loadAlldata: true
            },
            () => {
                this.handleLocationChange([{label: "All Location", value: '-1'}]);
                // this.handleCameraChange([{ label: "All Camera", value: '-1' }]);
                if (this.props?.user?.user_email === 'topspin_admin@tusker.ai') {
                    this.setFIlterTopspinParameters(
                        {
                            duration_type: "percentage",
                            initial_graph: true,
                            location_id: this.state.selectedLocationValue,
                            camera_id: this.state.selectedCameraValue,
                            selected_model_labels_list: this.state.selectedLabelValue,
                        },
                        "Today's " + this.state.dashboardGraphName + " Data Analysis",
                        false
                    );
                }
            }
        );


        this.setFilterParameters(
            {
                camera_id: this.state.selectedCameraValue,
                duration_type: "month"
            },
            this.state.dashboardGraphName + " Data Analysis",
            false
        );

        const WidgetLabalAndValueParam = {
            current_date: getCurrentDateAndTimeInIsoFormat(),
            location_id: this.state.selectedLocationValue,
            camera_id: this.state.selectedCameraValue,
            selected_model_labels_list: this.state.selectedLabelValue,
            duration_type: "day",
            initial_graph: true,
        };

        this.setWidgetLabelAndValue(WidgetLabalAndValueParam);
    };

    setFilterParameters = (parameters, title, drillApplied) => {
        this.setState({
            showGraph: false,
            graphMessage: "Loading.."
        });

        const {user} = this.props;
        let userRole = user.roles[0].role;
        getFilterGraphData(parameters, userRole, this.state.dashboardGraphName)
            .then(response => {
                if (response && response.data.length > 0) {
                    let startDateEndDateFlag = false;
                    this.setState({
                        blocking: false
                    });

                    let obj = response.data;

                    let labels = [];
                    let labelObj = obj[0];
                    Object.entries(labelObj).map(([key, value]) => {
                        labels.push(key);
                    });
                    const index = labels.indexOf("_id");
                    if (index > -1) {
                        labels.splice(index, 1);
                    }
                    let series = [];
                    for (let j = 0; j < labels.length; j++) {
                        let datalabel = labels[j];
                        series.push({name: datalabel, data: []});
                    }
                    let xAxis = [];
                    for (let y = 0; y < obj.length; y++) {
                        let graphObj = obj[y];
                        xAxis.push(graphObj._id);
                    }
                    for (let i = 0; i < labels.length; i++) {
                        for (let p = 0; p < obj.length; p++) {
                            let obj1 = obj[p];
                            let data = obj1[labels[i]];
                            for (let s in series) {
                                if (labels[i] == series[s].name) {
                                    series[s].data.push({
                                        name: labels[i],
                                        y: data,
                                        drilldown: true
                                    });
                                }
                            }
                        }
                    }

                    let initialGraph = true;
                    if (parameters.duration_type === "month") {
                        initialGraph = false;
                    } else if (parameters.duration_type === "day") {
                        initialGraph = true;
                    }

                    this.setState(
                        {
                            xAxis: xAxis,
                            yAxis: series
                        },
                        () => {
                            this.setState({
                                blocking: false,
                                startDateEndDateFlag: false,
                                initialGraph: initialGraph,
                                showGraph: true,
                                title: title,
                                parameters: parameters,
                                drillApplied: drillApplied,
                                // camera_id: this.state.location
                            });
                        }
                    );
                } else {
                    this.setState({
                        showGraph: false,
                        graphMessage: "No Data Found"
                    });
                }
            })
            .catch(err => {
                warningToast("Something went wrong");
                this.setState({
                    showGraph: false,
                    graphMessage: "No Data Found"
                });
            }); // API END BRACKETS
    };

    setFIlterTopspinParameters = (parameters, title, drillApplied) => {
        const data = {
            ...parameters,
            duration_type: "percentage"
        }
        this.setState({
            topspinFlag: true,
            mainLoading: true
        });
        getFilterResultOfAdminPercentage(data)
            .then(response => {
                if (response) {
                    this.setState({
                        topspinFlag: false,
                        mainLoading: false,
                        topspinHighchartData: response.data,
                    });
                } else {

                }
            })
            .catch(err => {
                warningToast("Something went wrong");
                this.setState({
                    topspinFlag: false,
                    mainLoading: false,
                    graphMessage: "No Data Found"
                });
            });
    }


    setXAxisYAxisAfterDrilldown = (xAxis, yAxis, drilldown) => {
        this.setState({
            xAxis: xAxis,
            yAxis: yAxis,
            drilldownFromFun: drilldown
        });
    };

    displayDataTableFromBar = (uniqueId, labelName) => {
        if (uniqueId && uniqueId !== "") {
            this.setState({
                showBarTable: false,
                blocking: true
            });

            const shouldSendLabelName = this.props.user.user_email === 'fieldai_admin@tusker.ai';

            getOneTableDataFromBar(uniqueId, shouldSendLabelName ? labelName : null, this.state.dashboardGraphName)
                .then(response => {
                    if (response && response.isSuccess) {
                        this.setState(
                            {
                                tableData: response.data
                            },
                            () => {
                                this.setState({
                                    showBarTable: true,
                                    blocking: false
                                });
                            }
                        );
                    }
                })
                .catch(err => {
                    this.setState({
                        showBarTable: false,
                        blocking: false
                    });
                    warningToast("Something went wrong");
                });


        } else {
            this.setState({
                showBarTable: false,
                blocking: false
            });
        }
    };

    handleDashboardGraphNameChange = e => {
        if (this.state.dashboardGraphName === "Label") {
            this.setState(
                {
                    dashboardGraphName: "Event"
                },
                () => {
                    this.setState(
                        {
                            graphType: "column",
                            drilldownFromFun: false,
                            currentTabOpenIndex: 1,
                            // selectedLabel:"-1",
                            // selectedLocation:['-1'],
                            // selectedCurrentLocation :['-1']
                            startDate: getCurrentStartDate(),
                            endDate: getCurrentEndDate(),
                            current_date: getCurrentDateAndTimeInIsoFormat(),
                            duration_type: "day",
                        },
                        () => this.loadInitialGraph(this.state.dashboardGraphName)
                    );
                    this.getAllLocations();
                }
            );
        } else {
            this.setState(
                {
                    dashboardGraphName: "Label"
                },
                () => {
                    this.setState(
                        {
                            graphType: "column",
                            drilldownFromFun: false,
                            currentTabOpenIndex: 0,
                            // selectedLabel:"-1",
                            // selectedLocation:['-1'] ,
                            // selectedCurrentLocation :['-1']
                            startDate: getCurrentStartDate(),
                            endDate: getCurrentEndDate(),
                            current_date: getCurrentDateAndTimeInIsoFormat(),
                            duration_type: "day",
                        },
                        () => this.loadInitialGraph(this.state.dashboardGraphName)
                    );
                    this.getAllLocations();
                }
            );
        }
    };

    dateTimeRangeChangeHandler = (startDate, endDate) => {
        this.setState({
            startDate: moment.utc(startDate).format(),
            endDate: moment.utc(endDate).format()
        });
    };

    componentDidUpdate(prevProps) {

        // Handling selectedIndex update
        if (prevProps.selectedIndex !== this.props.selectedIndex) {
            this.setState({ selectedIndex: this.props.selectedIndex });
        }
        // Handling popupData update
        if (prevProps.location.popupData !== this.props.location.popupData) {

            if (this.props.location.popupData && this.props.location.popupData.length > 0) {
                this.setState(
                    {
                        showBarTable: false,
                        blocking: true,
                        tableData: this.props.location.popupData
                    },
                    () => {
                        // Ensuring UI updates smoothly
                        this.setState({
                            showBarTable: true,
                            blocking: false
                        });
                    }
                );
            } else {
                // If popupData is empty, hide the modal
                this.setState({
                    showBarTable: false
                });
            }
        }
    }


    dateTimeRangeIndexChangeHandler = (rangeIndex, value) => {
        let dateVal = getSelectedDateTimeDefaultValue(value);
        let index = getSelectedDateTimeDefaultValueForRange(parseInt(dateVal, 10));
        // let reportFilterParameter = this.state.reportFilterParameter;
        let min = this.state.startDate;
        let max = this.state.endDate;
        let minDateNew = this.state.minDate;
        let maxDateNew = this.state.maxDate;
        if (parseInt(dateVal) === 12) {
            min = parseInt("defaultMin", 0);
            max = parseInt("defaultMax", 0);

            minDateNew = ["min"];
            maxDateNew = ["max"];
        }
        this.setState({
            typeValue: dateVal,
            selectedIndex: index,
            startDate: min,
            endDate: max,
            minDate: minDateNew,
            maxDate: maxDateNew
        });
    };

    applyFilter = (state, callback) => {
        this.setState({loadAlldata: false})
        let params = {};
        let startDate = moment.utc(this.state.startDate).format();
        let endDate = moment.utc(this.state.endDate).format();
        let location = this.state.selectedLocationValue
        let camera = this.state.selectedCameraValue
        let label = this.state.selectedLabelValue

        if (location.length < 1 && camera.length < 1 && label.length < 1) {
            warningToast("Please select all filter");
        } else {

            if (location.length > 0) {
                params.location_id = location
            } else {
                warningToast("Please select location")
            }
            if (camera.length > 0) {
                params.camera_id = camera
            } else {
                warningToast("Please select camera")
            }
            if (label.length > 0) {
                this.state.dashboardGraphName === "Label" ? (params.selected_model_labels_list = label) : (params.selected_event_list = label);
            } else if (camera.length > 0) {
                this.state.dashboardGraphName === "Label" ?
                    warningToast("Please select label") :
                    warningToast("Please select type")
            }
            if (this.state.startDate) {
                params.start_date = startDate;
            }

            if (this.state.endDate) {
                params.end_date = endDate;
            }
            if (
                params.hasOwnProperty("start_date") &&
                params.hasOwnProperty("end_date")
            ) {
                let startDate = new Date(params.start_date);
                let endDate = new Date(params.end_date);
                if (params.hasOwnProperty("no_date_selected") || this.state.isSameDate) {
                    params.duration_type = "day";
                } else if (
                    startDate.getMonth() === endDate.getMonth() &&
                    startDate.getFullYear() === endDate.getFullYear()
                ) {
                    params.duration_type = "month";
                } else {
                    params.duration_type = "month";
                }
            } else {
                params.duration_type = "month";
            }

            if (location.length > 0 && camera.length > 0 && label.length > 0) {

                const WidgetLabalAndValueParam = {
                    start_date: this.state.startDate,
                    end_date: this.state.endDate,
                    current_date: getCurrentDateAndTimeInIsoFormat(),
                    deployed_rtsp_job_id: 0,
                    camera_id: camera,
                    selected_model_labels_list: label,
                    duration_type: "day",
                    initial_graph: true,
                    location_id: location
                };

                this.setWidgetLabelAndValue(WidgetLabalAndValueParam);
                this.setFilterParameters(params, this.state.dashboardGraphName + " Data Analysis", false);

                this.setFIlterTopspinParameters(params, this.state.dashboardGraphName + " Data Analysis", false);

            }
        }


    };


    clearFilter = () => {
        this.setState(
            {
                // label: "",
                // location: "",
                startDate: getCurrentStartDate(),
                endDate: getCurrentEndDate(),
                // selectedLabel: "-1",
                // selectedLocation: "-1",
                // selectedCurrentLocation: "-1",
                //   location_id: ['-1'],
                // cameraLocationOptions: this.state.defaultCameraOptions,
                // labelOptions: [],
                selectedLocationValue: ['-1'],
                selectedCameraValue: ['-1'],
                selectedLabelValue: '-1',
                selectedIndex: 0,
                notice: false,
                allLabelFlag: true

            },
            () => {
                this.handleLocationChange([{label: "All Location", value: '-1'}]);
                // this.handleCameraChange([{ label: "All Camera", value: '-1' }]);
                const WidgetLabalAndValueParam = {
                    start_date: getCurrentStartDate(),
                    end_date: getCurrentEndDate(),
                    current_date: getCurrentDateAndTimeInIsoFormat(),
                    deployed_rtsp_job_id: 0,
                    location_id: this.state.selectedLocationValue,
                    camera_id: this.state.selectedCameraValue,
                    selected_model_labels_list: this.state.selectedLabelValue,
                    duration_type: "day",
                    initial_graph: true,
                };

                this.setWidgetLabelAndValue(WidgetLabalAndValueParam);
                this.loadInitialGraph();
            }
        );
    };

    getAllLocations = () => {
        const {user} = this.props;
        let userRole = user.roles[0].role;
        this.setState({
            locationLoading: true
        });
        getEnabledLocationList(userRole)
            .then(response => {
                if (response && response.data) {
                    let locationOptions = [];
                    response.data.map(obj =>
                        locationOptions.push({label: obj.location_name, value: obj.id})
                    );
                    locationOptions.push({label: "All Location", value: '-1'});

                    this.setState(
                        {
                            locationOptions: locationOptions,
                            // selectedCurrentLocationOptions: locationOptions,
                            locationLoading: false
                        },
                        () => {
                            this.handleLocationChange([{label: "All Location", value: '-1'}]);
                        }
                    );
                }
            })
            .catch(error => {
                this.setState({locationLoading: false});
                if (error.detail) {
                    warningToast(error.detail);
                } else {
                    warningToast("Something went Wrong");
                }
            });
    };

    handleLocationChange = selectedCurrentLocation => {
        if (
            selectedCurrentLocation === null ||
            selectedCurrentLocation.length === 0
        ) {
            this.setState({
                selectedLabel: [],
                selectedLabelValue: [],
                selectedCamera: [],
                selectedCameraValue: [],
            });
        }

        let selectedLocationArray = [];
        if (selectedCurrentLocation) {
            for (let i = 0; i < selectedCurrentLocation.length; i++) {
                selectedLocationArray.push(selectedCurrentLocation[i].value.toString());
            }
        }

        this.setState(
            {
                selectedLocation: selectedCurrentLocation,
                selectedLocationValue: selectedLocationArray
            },
            () => {
                const {user} = this.props;
                let userRole = user.roles[0].role;

                if (this.state.selectedLocationValue && this.state.selectedLocationValue.length > 0) {
                    getTotalCamerasByLocationId(this.state.selectedLocationValue)
                        .then(res => {
                            if (res && res.isSuccess) {
                                let cameraOptions = [];

                                res.data.map((item, index) => {
                                    //   cameras.push(item.id.toString());
                                    cameraOptions.push({label: item.camera_name, value: item.id});
                                    return null;
                                });
                                cameraOptions.push({label: "All Camera", value: '-1'});
                                // camOpt.push({ label: "All Camera", value: '-1' });

                                this.setState(
                                    {
                                        cameraOptions: cameraOptions
                                    },
                                    () => {

                                        //Todo
                                        let selectedCurrentLocationData = [];
                                        selectedCurrentLocation.map(x => {
                                            if (x.value === '-1') {
                                                selectedCurrentLocationData.push(x.value);
                                            }
                                        });

                                        if (this.state.dashboardGraphName === "Label") {
                                            this.handleCameraChange([
                                                {label: "All Camera", value: '-1'}
                                            ]);
                                        } else if (this.state.dashboardGraphName === "Event") {
                                            this.handleCameraChangeForEventType([
                                                {label: "All Camera", value: '-1'}
                                            ]);
                                        }
                                    }
                                );
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
                } else {
                    this.setState({
                        // selectedLabel: "",
                        // labelOptions: []
                    });
                }
            }
        );
    };

    handleCameraChange = selectedCamera => {

        let selectedCameraArray = [];
        if (selectedCamera) {
            for (let i = 0; i < selectedCamera.length; i++) {
                selectedCameraArray.push(selectedCamera[i].value.toString());
            }
        }
        this.setState(
            {
                // selectedLocation,
                // location: selectedLocationArray
                selectedCamera: selectedCamera,
                selectedCameraValue: selectedCameraArray,
            },
            () => {

                const {user} = this.props;
                let userRole = user.roles[0].role;

                if (this.state.selectedCameraValue && this.state.selectedCameraValue.length > 0) {
                    // let camera_list = [];
                    // selectedCamera.map((item, index) => {
                    //   let x = parseInt(item.value);
                    //   camera_list.push(x);
                    //   return null;
                    // });

                    this.setState({labelLoading: true});

                    const body = {
                        camera_id: this.state.selectedCameraValue,
                        location_id: this.state.selectedLocationValue
                    };

                    getAllLabelsFromListOfCameraId(body, userRole)
                        .then(res => {
                            if (res && res.isSuccess) {
                                const labelOptions = res.data.map(x => x.labels);
                                labelOptions.push("All Label");
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
                                uniqueLabels.map(x => {
                                    if (x === "All Label") {
                                        finale_labels.push({label: x, value: '-1'});
                                    } else {
                                        finale_labels.push({label: x, value: x});
                                    }
                                });

                                this.setState(
                                    {
                                        labelLoading: false
                                    },
                                    () => {
                                        this.setState(
                                            {
                                                labelOptions: finale_labels
                                            },
                                            () => {
                                                let selectedLocationData = [];
                                                if (selectedCamera) {
                                                    selectedCamera.map(x => {
                                                        if (x.label === "All Camera") {
                                                            selectedLocationData.push(x.label);
                                                        }
                                                    });
                                                }

                                                this.handleLabelChange([
                                                    {label: "All Label", value: '-1'}
                                                ]);
                                                this.setState({
                                                    allLabelFlag: false
                                                });

                                            }
                                        );
                                    }
                                );
                            } else {
                                this.setState({labelLoading: false});
                                warningToast("Something went wrong");
                            }
                        })
                        .catch(error => {
                            this.setState({labelLoading: false});
                            if (error.detail) {
                                warningToast(error.detail);
                            } else {
                                warningToast("Something went Wrong");
                            }
                        });
                }
                    //
                //

                else {
                    // this.setState({ labelLoading: true });
                    const body = {
                        // camera_id: ['-1'],
                        // location_id: this.state.currentLocation
                    };

                    // getAllLabelsFromListOfCameraId(body, userRole)
                    //   .then(res => {
                    //     if (res && res.isSuccess) {
                    //       const labelOptions = res.data.map(x => x.labels);
                    //       labelOptions.push("All Label");
                    //       let labels = [];
                    //       let finale_labels = [];
                    //       labelOptions.map((item, index) => {
                    //         let arr = item.split(",");
                    //         arr.map(x => {
                    //           labels.push(x);
                    //           return null;
                    //         });
                    //         return null;
                    //       });
                    //       let uniqueLabels = Array.from(new Set(labels));
                    //       uniqueLabels.map(x => {
                    //         if (x === "All Label") {
                    //           finale_labels.push({ label: x, value: '-1' });
                    //         } else {
                    //           finale_labels.push({ label: x, value: x });
                    //         }
                    //       });
                    //
                    //       this.setState(
                    //           {
                    //             labelLoading: false
                    //           },
                    //           () => {
                    //             this.setState(
                    //                 {
                    //                   labelOptions: finale_labels
                    //                 }
                    //             );
                    //           }
                    //       );
                    //     }
                    //   })
                    //   .catch(error => {
                    //     this.setState({ labelLoading: false });
                    //     if (error.detail) {
                    //       warningToast(error.detail);
                    //     } else {
                    //       warningToast("Something went Wrong");
                    //     }
                    //   });

                    this.setState({
                        selectedLabel: "",
                        // labelOptions: []
                    });
                }
            }
        );
    };

    handleCameraChangeForEventType = selectedCamera => {
        let selectedCameraArray = [];
        if (selectedCamera) {
            for (let i = 0; i < selectedCamera.length; i++) {
                selectedCameraArray.push(selectedCamera[i].value.toString());
            }
        }
        this.setState(
            {
                // selectedLocation,
                // location: selectedLocationArray
                selectedCamera: selectedCamera,
                selectedCameraValue: selectedCameraArray,
            },
            () => {
                const {user} = this.props;
                let userRole = user.roles[0].role;
                if (this.state.selectedCameraValue && this.state.selectedCameraValue.length > 0) {
                    // let camera_list = [];
                    // selectedCamera.map((item, index) => {
                    //   let x = item.value.toString();
                    //   camera_list.push(x);
                    //   return null;
                    // });

                    this.setState({labelLoading: true});
                    const body = {
                        camera_id_list: this.state.selectedCameraValue,
                        location_id_list: this.state.selectedLocationValue

                    };
                    getDiffEventsByCameraId(body)
                        .then(res => {
                            if (res && res.isSuccess) {
                                const labelOptions = res.data.map(x => x);
                                labelOptions.push("All Type");
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
                                uniqueLabels.map(x => {
                                    if (x === "All Type") {
                                        finale_labels.push({label: x, value: '-1'});
                                    } else {
                                        finale_labels.push({label: x, value: x});
                                    }
                                });

                                this.setState(
                                    {
                                        labelLoading: false
                                    },
                                    () => {
                                        this.setState(
                                            {
                                                labelOptions: finale_labels
                                            },
                                            () => {
                                                let selectedLocationData = [];
                                                if (selectedCamera) {
                                                    selectedCamera.map(x => {
                                                        if (x.label === "All Camera") {
                                                            selectedLocationData.push(x.label);
                                                        }
                                                    });
                                                }

                                                this.handleTypeChange([
                                                    {label: "All Type", value: '-1'}
                                                ]);
                                                this.setState({
                                                    allLabelFlag: false
                                                });

                                            }
                                        );
                                    }
                                );
                            } else {
                                this.setState({labelLoading: false});
                                warningToast("Something went wrong");
                            }
                        })
                        .catch(error => {
                            this.setState({labelLoading: false});
                            if (error.detail) {
                                warningToast(<error className="detail"></error>);
                            } else {
                                warningToast("Something went Wrong");
                            }
                        });

                } else {
                    this.setState({
                        selectedLabel: "",
                        labelOptions: []
                    });
                }
            }
        );
    };

    handleTypeChange = selectedLabel => {
        let selectedLabelArray = "";
        if (selectedLabel) {
            if (selectedLabel.length === 1) {
                selectedLabelArray = `${selectedLabel[0].value}`;
            } else {
                for (let i = 0; i < selectedLabel.length; i++) {
                    // selectedLabelArray.push();
                    selectedLabelArray += `${selectedLabel[i].value}`
                    if (i !== selectedLabel.length - 1) {
                        selectedLabelArray += ","
                    }
                }
            }

        }

        this.setState({
            selectedLabel: selectedLabel,
            selectedLabelValue: selectedLabelArray,
        });
    };

    handleLabelChange = selectedLabel => {
        let selectedLabelArray = "";
        if (selectedLabel) {
            if (selectedLabel.length === 1) {
                selectedLabelArray = `${selectedLabel[0].value}`;
            } else {
                for (let i = 0; i < selectedLabel.length; i++) {
                    selectedLabelArray += `${selectedLabel[i].value}`
                    if (i !== selectedLabel.length - 1) {
                        selectedLabelArray += ","
                    }
                }
            }

        }

        this.setState({
            selectedLabel: selectedLabel,
            selectedLabelValue: selectedLabelArray,
        });
    };

    render() {
        const {classes} = this.props;
        const {
            locationLoading,
            locationOptions,
            selectedLocation,

            totalCamerasByLocationLoading,
            cameraOptions,
            selectedCamera,

            labelLoading,
            labelOptions,
            selectedLabel
        } = this.state;

        return (
            <>
                <Card
                    className="example example-compact"
                    style={{minHeight: "150px", overflow: "visible"}}
                >
                    <CardBody style={{padding: "10px 10px"}}>
                        <Row>
                            <Col xl={8} lg={8} xs={12} md={7} sm={12}>
                                <CardHeader title="Event Information"/>
                            </Col>
                            <Col xl={4} lg={4} xs={12} md={5} sm={12}>
                                <div className={"mt-5 d-flex justify-content-lg-end"}>
                                    {!this.state.loadInitialGraphFlag && (
                                        <Button
                                            variant="primary"
                                            className={"mr-4 btn-apply-filter"}
                                            onClick={this.loadInitialGraph}
                                        >
                                            Load Latest Data
                                        </Button>
                                    )}
                                    {this.state.loadInitialGraphFlag && (
                                        <Button
                                            variant="primary"
                                            className={"mr-4 btn-apply-filter loadtop"}
                                            onClick={this.loadAllYearData}
                                        >
                                            Load All Data
                                        </Button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                        <hr/>

                        <Row className="space">
                            <Col xl={2} xs={12} md={6} sm={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-4">Select Location</Form.Label>
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
                                        isLoading={locationLoading}
                                        isSearchable={true}
                                        isMulti={true}
                                        placeholder="Select Location"
                                        className="select-react-dropdown"
                                        value={selectedLocation}
                                        onChange={this.handleLocationChange}
                                        options={locationOptions}
                                        styles={customStyles}
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
                                        isMulti={true}
                                        styles={customStyles}
                                        // defaultValue={{ label: "All Camera", value: "all" }}
                                        isLoading={totalCamerasByLocationLoading}
                                        placeholder="Select Camera"
                                        value={selectedCamera}
                                        onChange={
                                            this.state.dashboardGraphName === "Label"
                                                ? this.handleCameraChange
                                                : this.handleCameraChangeForEventType
                                        }
                                        options={cameraOptions}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xl={2} xs={12} md={6} sm={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-4">
                                        {this.state.dashboardGraphName === "Label"
                                            ? "Select Label"
                                            : "Select Type"}
                                    </Form.Label>
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
                                        isLoading={labelLoading}
                                        isMulti={true}
                                        placeholder={
                                            this.state.dashboardGraphName === "Label"
                                                ? "Select Label"
                                                : "Select Type"
                                        }
                                        value={selectedLabel}
                                        onChange={
                                            this.state.dashboardGraphName === "Label"
                                                ? this.handleLabelChange
                                                : this.handleTypeChange
                                        }
                                        options={labelOptions}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xl={4} xs={12} md={6} sm={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-4">Select Date Range</Form.Label>
                                    <FormDateRangePicker
                                        rangeIndex={this.state.selectedIndex}
                                        minDate={this.state.minDate}
                                        maxDate={this.state.maxDate}
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        changeDateTimeRange={this.dateTimeRangeChangeHandler}
                                        changeDateTimeRangeIndex={
                                            this.dateTimeRangeIndexChangeHandler
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col xl={2} xs={12} md={12} sm={12}>
                                <div className={"d-flex mr-2 mt-5"}>
                                    <Button
                                        style={{paddingLeft: "10px", paddingRight: "10px"}}
                                        disabled={this.state.btndisabled}
                                        className={"mt-5 btn-apply-filter"}
                                        onClick={this.applyFilter}
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
                                            onClick={this.clearFilter}
                                            // size="lg"
                                            className="btn btn-light btn-elevate mt-5 ml-2"
                                        >
                                            Reset filter
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </Col>
                        </Row>

                        <Row className="space">
                            <div className={"col-xl-12 col-md-12 mb-3"}>
                                <div>
                  <span>
                    <b>Note:</b> This dashboard covers
                  </span>
                                    <span>
                    {" "}
                                        <b>
                      {this.state.notice
                          ? " specific date range data."
                          : "all data. "}
                    </b>
                  </span>
                                    <span>Apply below filter for further data analytics. </span>
                                </div>
                            </div>
                        </Row>
                    </CardBody>
                </Card>

                <BlockUi tag="div" blocking={this.state.blocking} color="#147b82">
                    <div className="row-xl-12 mt-6">
                        <div className={`card card-custom col-lg-12 col-xl-12 my-widget3`}>
                            {/* Body */}
                            <div className="card-body  p-0 position-relative overflow-hidden">
                                {/* Chart */}
                                <div
                                    id="kt_mixed_widget_1_chart"
                                    className="card-rounded-bottom "
                                    // height: "90px",
                                    style={{backgroundColor: "white"}}
                                ></div>

                                {/* Stat */}
                                <div className="card-spacer">
                                    <div className=" m-0 box-customer-grid">
                                        {/*1*/}
                                        <div className=" bg-primary px-6 py-8 rounded-xl ml-3 mr-3 box-customer-widget">
                                            <div className={"d-flex"}>
                        <span className="svg-icon svg-icon-3x svg-icon-white d-block my-2">
                          <SVG
                              src={toAbsoluteUrl(
                                  "/media/svg/icons/Layout/Layout-4-blocks.svg"
                              )}
                          ></SVG>
                        </span>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="user-notification-tooltip">
                                                            {this.state.widget &&
                                                                this.state.widget[
                                                                this.state.keys && this.state.keys[0]
                                                                    ]}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <div
                                                        className="text-white font-weight-bold font-size-h2 mt-3 ml-2 wizard-overFlowView cursor-pointer ">
                                                        {this.state.widget &&
                                                            this.state.widget[
                                                            this.state.keys && this.state.keys[0]
                                                                ]}
                                                    </div>
                                                </OverlayTrigger>
                                            </div>
                                            <div
                                                className={`text-white font-weight-bold font-size-h6 ml-3`}
                                            >
                                                {this.state.widgeTitle && this.state.widgeTitle[0]}
                                            </div>
                                        </div>

                                        {/*2*/}
                                        <div className=" bg-primary px-6 py-8 rounded-xl ml-3 mr-3 box-customer-widget">
                                            <div className={"d-flex"}>
                        <span className="svg-icon svg-icon-3x svg-icon-white d-block my-2">
                          <SVG
                              src={toAbsoluteUrl(
                                  "/media/svg/icons/Layout/Layout-4-blocks.svg"
                              )}
                          ></SVG>
                        </span>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="user-notification-tooltip">
                                                            {this.state.widget &&
                                                                this.state.widget[
                                                                this.state.keys && this.state.keys[1]
                                                                    ]}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <div
                                                        className={`text-white font-weight-bold font-size-h2 mt-3 ml-2 wizard-overFlowView cursor-pointer`}
                                                    >
                                                        {this.state.widget &&
                                                            this.state.widget[
                                                            this.state.keys && this.state.keys[1]
                                                                ]}
                                                    </div>
                                                </OverlayTrigger>
                                            </div>

                                            <div
                                                className={`text-white font-weight-bold font-size-h6 ml-3 `}
                                            >
                                                {this.state.widgeTitle && this.state.widgeTitle[1]}
                                            </div>
                                        </div>

                                        {/*3*/}
                                        <div className=" bg-primary px-6 py-8 rounded-xl ml-3 mr-3 box-customer-widget">
                                            <div className={"d-flex"}>
                        <span className="svg-icon svg-icon-3x svg-icon-white d-block my-2">
                          <SVG
                              src={toAbsoluteUrl(
                                  "/media/svg/icons/Layout/Layout-4-blocks.svg"
                              )}
                          ></SVG>
                        </span>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="user-notification-tooltip">
                                                            {this.state.widget &&
                                                                this.state.widget[
                                                                this.state.keys && this.state.keys[2]
                                                                    ]}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <div
                                                        className={`text-white font-weight-bold font-size-h2 ml-2 mt-3 wizard-overFlowView cursor-pointer`}
                                                    >
                                                        {this.state.widget &&
                                                            this.state.widget[
                                                            this.state.keys && this.state.keys[2]
                                                                ]}
                                                    </div>
                                                </OverlayTrigger>
                                            </div>

                                            <div
                                                className={`text-white font-weight-bold font-size-h6 ml-3`}
                                            >
                                                {this.state.widgeTitle && this.state.widgeTitle[2]}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"row mt-6"} id="content">
                        <div className="col-xl-12">
                            <div
                                className={
                                    "graph-dashboard-card card p-4 card-custom gutter-b bgi-no-repeat bgi-no-repeat bgi-size-cover"
                                }
                            >
                                <Box sx={{width: "100%", bgcolor: "background.paper"}}>
                                    <Tabs
                                        value={this.state.currentTabOpenIndex}
                                        onChange={e => this.handleDashboardGraphNameChange(e)}
                                        centered
                                    >
                                        <Tab label="Results Analysis"/>
                                    </Tabs>
                                </Box>

                                {this.state.showGraph && (
                                    <>
                                        <div className={"graph-dropdown-div mt-2"}>
                                            <div style={{float: "left"}}>
                                                <InputLabel htmlFor="age-native-simple">
                                                    Graph
                                                </InputLabel>
                                                <FormControl>
                                                    <DropDownMatrialUi
                                                        graphType={this.state.graphType}
                                                        handleGraphChange={this.handleGraphChange}
                                                        drilldownFromFun={this.state.drilldownFromFun}
                                                    />
                                                </FormControl>
                                            </div>
                                        </div>


                                        <DashboardGraph
                                            displayDataTableFromBar={this.displayDataTableFromBar}
                                            parameters={this.state.parameters}
                                            startDateEndDateFlag={this.state.startDateEndDateFlag}
                                            setXAxisYAxisAfterDrilldown={
                                                this.setXAxisYAxisAfterDrilldown
                                            }
                                            locationId={this.state.selectedLocationValue}
                                            cameraId={this.state.selectedCameraValue}
                                            selected_model_labels_list={this.state.selectedLabelValue}
                                            setFilterParameters={this.setFilterParameters}
                                            drillApplied={this.state.drillApplied}
                                            title={this.state.title}
                                            xAxis={this.state.xAxis}
                                            yAxis={this.state.yAxis}
                                            graphType={this.state.graphType}
                                            dashboardGraphName={this.state.dashboardGraphName}
                                        />
                                    </>
                                )}


                                {this.state.showGraph === false && (
                                    <div style={{textAlign: "center"}}>
                                        <h4 className={"mt-5"}>{this.state.graphMessage}</h4>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>

                        {this.state.showBarTable && (
                            <DashboardTable
                                showBarTable={this.state.showBarTable}
                                cameraData={this.state.cameraOptions}
                                tableData={this.state.tableData}
                                dashboardGraphName={this.state.dashboardGraphName}
                                user={this.props.user}
                            />
                        )}
                    </div>

                    {/*<DashboardGetSubscription />*/}
                </BlockUi>
            </>
        );
    }
}

function mapStateToProps(state) {
    const {auth} = state;
    return {user: auth.user, location: state.location};
}

export default connect(
    mapStateToProps,
    auth.actions
)(withStyles(styles)(Demo2Dashboard));
