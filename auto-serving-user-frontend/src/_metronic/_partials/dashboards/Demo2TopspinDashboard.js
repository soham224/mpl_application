import React, { Component } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
    getAllDeployedRTSPJobsDetails,
    getFilterResultOfAdminPercentage,
    getOneTableDataFromBar, getTotalCamerasByLocationId,
} from "../../../app/Admin/modules/DashboardGraph/_redux";
import { connect } from "react-redux";
import * as auth from "../../../app/Admin/modules/Auth";
import { warningToast } from "../../../utils/ToastMessage";
import {
  getCurrentDateAndTimeInIsoFormat,
  getCurrentEndDate,
  getCurrentStartDate
} from "../../../utils/TimeZone";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import { CardBody, Col, Row } from "reactstrap";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import FormDateRangePicker from "../../../utils/dateRangePicker/FormDateRangePicker";
import getSelectedDateTimeDefaultValue from "../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../utils/dateRangePicker/dateRangeFunctions";
import MyChart from "./TopspinDashboardTwo";
import TopspinDashboardOne from "./TopspinDashboardOne";

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
      locationLoading: false,
      locationOptions : [],
      selectedLocation:[],
      selectedLocationValue : ['-1'],
      totalCamerasByLocationLoading: false,
      cameraOptions : [],
      selectedCamera :[],
      selectedCameraValue : ['-1'],
      labelLoading: false,
      labelOptions :[],
      selectedLabel:[],
      selectedLabelValue:'table_occupied,table_not_occupied',
        loadAlldata:false,
        topspinHighchartData : [],
        mainLoading:false,
        topspinFlag:false,
        topspinHighchartDataChair: [],
        mainLoadingChair:false,
        topspinFlagChair:false,

        cameraList : [],
    };
  }


  componentDidMount() {
      const url = new URL(window.location.href);
    this.setState({
      allLabelFlag: true,
        pathname: url.pathname
    });

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



      this.getTotalCamerasByLocationIds(["-1"])
  }

    getTotalCamerasByLocationIds = (parameters) =>{
        // const data = {
        //     ...parameters,
        //     duration_type: "percentage"
        // }
        // this.setState({
        //     showGraph: false,
        //     graphMessage: "Loading..",
        // });
        getTotalCamerasByLocationId(parameters)
            .then(response => {
                if(response && response.data.length > 0){
                    this.setState({
                        cameraList : response.data
                    })
                }
                else {
                }
            })
            .catch(err => {
                warningToast("Something went wrong");
                // this.setState({
                //     topspinFlag: false,
                //     mainLoading : false,
                //     showGraph: false,
                //     graphMessage: "No Data Found"
                // });
            });
    }




    handleGraphChange = event => {
    this.setState({
      graphType: event.target.value
    });
  };

  loadInitialGraph = () => {
    this.setState(
        {
          loadInitialGraphFlag: true,
          showBarTable: false,
          graphType: "column",
          drilldownFromFun: false,
          parameters: {},
          notice: false

        },
        () => {
              this.setFIlterTopspinParameters(
                  {
                      start_date: this.state.startDate,
                      end_date: this.state.endDate,
                      current_date: getCurrentDateAndTimeInIsoFormat(),
                      duration_type: "day",
                      initial_graph: true,
                      location_id: this.state.selectedLocationValue,
                      camera_id: this.state.selectedCameraValue,
                      selected_model_labels_list: 'table_occupied,table_not_occupied',
                  },
                  "Today's " + this.state.dashboardGraphName + " Data Analysis",
                  false
              );
              this.setFIlterTopspinParametersChair(
                  {
                      start_date: this.state.startDate,
                      end_date: this.state.endDate,
                      current_date: getCurrentDateAndTimeInIsoFormat(),
                      duration_type: "day",
                      initial_graph: true,
                      location_id: this.state.selectedLocationValue,
                      camera_id: this.state.selectedCameraValue,
                      selected_model_labels_list: 'chair_occupied,chair_not_occupied',
                  },
                  "Today's " + this.state.dashboardGraphName + " Data Analysis",
                  false
              );


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
          loadAlldata : true
        },
        () => {

                this.setFIlterTopspinParameters(
                    {
                        duration_type: "percentage",
                        initial_graph: true,
                        location_id: this.state.selectedLocationValue,
                        camera_id: this.state.selectedCameraValue,
                        selected_model_labels_list: 'table_occupied,table_not_occupied',
                    },
                    "Today's " + this.state.dashboardGraphName + " Data Analysis",
                    false
                );

            this.setFIlterTopspinParametersChair(
                {
                    duration_type: "percentage",
                    initial_graph: true,
                    location_id: this.state.selectedLocationValue,
                    camera_id: this.state.selectedCameraValue,
                    selected_model_labels_list: 'chair_occupied,chair_not_occupied',
                },
                "Today's " + this.state.dashboardGraphName + " Data Analysis",
                false
            );

        }
    );

  };


  setFIlterTopspinParameters = (parameters, title, drillApplied) =>{
      const data = {
        ...parameters,
          duration_type: "percentage"
      }
      this.setState({
          showGraph: false,
          graphMessage: "Loading..",
      });
      getFilterResultOfAdminPercentage(data)
          .then(response => {
                  if(response && response.data.length > 0){
                      this.setState({
                          topspinFlag : false,
                          mainLoading : false,
                          showGraph: true,
                          topspinHighchartData: response.data,
                      });

                  }
                  else {
                      this.setState({
                          showGraph: false,
                          graphMessage: "No Data Found"
                      });
              }
          })
          .catch(err => {
              warningToast("Something went wrong");
              this.setState({
                  topspinFlag: false,
                  mainLoading : false,
                  showGraph: false,
                  graphMessage: "No Data Found"
              });
          });
  }


    setFIlterTopspinParametersChair = (parameters, title, drillApplied) =>{
        const data = {
            ...parameters,
            duration_type: "percentage"
        }
        this.setState({
            showGraphChair: false,
            graphMessageChair: "Loading..",
        });
        getFilterResultOfAdminPercentage(data)
            .then(response => {
                if(response && response.data.length > 0){
                    this.setState({
                        topspinFlagChair : false,
                        mainLoadingChair : false,
                        showGraphChair: true,
                        topspinHighchartDataChair: response.data,
                    });

                }
                else {
                    this.setState({
                        showGraphChair: false,
                        graphMessageChair: "No Data Found"
                    });
                }
            })
            .catch(err => {
                warningToast("Something went wrong");
                this.setState({
                    topspinFlagChair: false,
                    mainLoadingChair : false,
                    showGraphChair: false,
                    graphMessageChair: "No Data Found"
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

  displayDataTableFromBar = uniqueId => {
    if (uniqueId && uniqueId !== "") {
      this.setState({
        showBarTable: false,
        blocking: true
      });
      getOneTableDataFromBar(uniqueId, this.state.dashboardGraphName)
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
                  startDate: getCurrentStartDate(),
                  endDate: getCurrentEndDate(),
                  current_date: getCurrentDateAndTimeInIsoFormat(),
                  duration_type: "day",
                },
                () => this.loadInitialGraph(this.state.dashboardGraphName)
            );

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

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.selectedIndex !== this.state.selectedIndex) {
      this.setState({
        selectedIndex: nextProps.selectedIndex
      });
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


          if(label.length > 0){
              this.state.dashboardGraphName === "Label" ? (params.selected_model_labels_list = label) : (params.selected_event_list = label);
          } else if(camera.length > 0) {
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

          if(location.length > 0 && camera.length > 0 && label.length > 0){
              this.setFIlterTopspinParameters(params, this.state.dashboardGraphName + " Data Analysis", false);
              this.setFIlterTopspinParametersChair(
                  {
                      duration_type: "percentage",
                      start_date: startDate,
                      end_date: endDate,
                      initial_graph: true,
                      location_id: this.state.selectedLocationValue,
                      camera_id: this.state.selectedCameraValue,
                      selected_model_labels_list: 'chair_occupied,chair_not_occupied',
                  },
                  "Today's " + this.state.dashboardGraphName + " Data Analysis",
                  false
              );
          }

  };




  clearFilter = () => {
    this.setState(
        {
          startDate: getCurrentStartDate(),
          endDate: getCurrentEndDate(),
          selectedLocationValue : ['-1'],
          selectedCameraValue : ['-1'],
          selectedLabelValue:'-1',
          selectedIndex: 0,
          notice: false,
          allLabelFlag: true

        },
        () => {

          this.loadInitialGraph();
        }
    );
  };



  render() {
    const { classes } = this.props;
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

            <hr/>


            <MyChart
                topspinHighchartData={this.state.topspinHighchartData}
                topspinFlag={this.state.topspinFlag}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                locationId={this.state.selectedLocationValue}
                cameraId={this.state.selectedCameraValue}
                mainLoading={this.state.mainLoading}
                loadAlldata={this.state.loadAlldata}
                showGraph={this.state.showGraph}
                graphMessage={this.state.graphMessage}
                cameraList={this.state.cameraList}

            />

            <hr/>
            <TopspinDashboardOne
                topspinHighchartData={this.state.topspinHighchartDataChair}
                topspinFlag={this.state.topspinFlagChair}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                locationId={this.state.selectedLocationValue}
                cameraId={this.state.selectedCameraValue}
                mainLoading={this.state.mainLoadingChair}
                loadAlldata={this.state.loadAlldata}
                showGraph={this.state.showGraphChair}
                graphMessage={this.state.graphMessageChair}
                cameraList={this.state.cameraList}
            />


        </>
    );
  }
}

function mapStateToProps(state) {
  const { auth } = state;
  return { user: auth.user };
}

export default connect(
    mapStateToProps,
    auth.actions
)(withStyles(styles)(Demo2Dashboard));
