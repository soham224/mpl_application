import React, { Component, Fragment } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { Card, CardBody } from "reactstrap";
import {Box, Chip, Tab, Tabs} from "@material-ui/core";
import {getCurrentDateAndTimeInIsoFormat} from "../../../utils/TimeZone";
import {
    getDataOfLastGraphStepList,
} from "../../../app/Admin/modules/DashboardGraph/_redux";
import {warningToast} from "../../../utils/ToastMessage";
import moment from "moment";
import CardContent from "@material-ui/core/CardContent";
import Boundingbox from "image-bounding-box-custom";
import CardMedia from "@material-ui/core/CardMedia";


class TopspinDashboardOne extends Component {
    constructor(props) {
        super(props);
        const data = props.topspinHighchartData || [];
        this.state = {
            chartType: 'main',
            options: this.getMainChartOptions(data), // Use provided data
            showModal: false,
            selectedDate: '',
            selectedImage: '',
            topspinHighchartDayData : [],
            modalData :[],
            loadingModal : false,
            showGraph: false,

        };
    }

    getMainChartOptions = (data) => {
        if (!data || data.length === 0) {
            return {
                title: {
                    text: '' // Explicitly set the title to empty
                },
                series: [],
                xAxis: {
                    categories: [] // No categories since there's no data
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    }
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    enabled: false // Disable tooltips since there's no data
                },
            };
        }

        const seriesData = Object.keys(data[0])
            .filter(key => key !== "_id") // Exclude the _id field
            .map((key, index) => ({
                type: 'column',
                name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), // Convert to "Red Hat"
                data: data.map(item => item[key]),
                color: colors[index % colors.length], // Cycle through colors
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return `${this.y.toFixed(2)}%`; // Show percentage with % sign
                    }
                }
            }));

        return {
            title: {
                text: '' // Explicitly set the title to empty
            },
            xAxis: {
                categories: data.map(item => item._id) // ['Morning', 'Afternoon', 'Evening', 'Night']
            },
            series: seriesData,
            legend: {
                enabled: true
            },
            plotOptions: {
                series: {
                    turboThreshold: 0,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            return `${this.y.toFixed(2)}`; // Show percentage
                        }
                    },
                    point: {
                        // events: {
                        //     click: (event) => this.handleBarClick(event.point)
                        // }
                        events: {
                            click: this.displayTableOnLastDrilldown.bind(this),
                        },
                    }
                }
            },
            credits: {
                enabled: false
            }
        };
    };

    displayTableOnLastDrilldown = (data) => {
        this.handleBarClick(data.point);
    };

    handleBarClick = (timeOfDay) => {
        const category = timeOfDay?.category
        const categoryNew = timeOfDay?.series?.userOptions?.name
        this.setState({ chartType: 'date' });
        let data
        if(this.props.loadAlldata){
            data = {
                "day_time":category,
                "current_date": getCurrentDateAndTimeInIsoFormat(),
                // "duration_type": "day",
                "initial_graph": true,
                "location_id": this.props.locationId,
                "camera_id": this.props.cameraId,
                "selected_model_labels_list": categoryNew.split(' ').map(word => word.toLowerCase()).join('_')
            }
        }else {
            data = {
                "day_time":category,
                "start_date": this.props.startDate,
                "end_date": this.props.endDate,
                "current_date": getCurrentDateAndTimeInIsoFormat(),
                // "duration_type": "day",
                "initial_graph": true,
                "location_id": this.props.locationId,
                "camera_id": this.props.cameraId,
                "selected_model_labels_list": categoryNew.split(' ').map(word => word.toLowerCase()).join('_')
            }
        }

        this.fetchDataLastGraphStepList(data);

    };

    fetchDataLastGraphStepList = (data) => {
        this.setState({
            showModal: false,
        });
        getDataOfLastGraphStepList(data)
            .then(response => {
                if (response) {
                    this.setState({
                        modalData: response.data,
                        showModal : true,
                    })
                }
            })
            .catch(err => {
                console.log("error:::",err)
                warningToast("Something went wrong");
                this.setState({
                    showModal: false,
                });
            });
    };



    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    handleBackToMain = () => {
        const data = this.props.topspinHighchartData || [];
        this.setState({
            chartType: 'main',
            options: this.getMainChartOptions(data) // Reset to current data
        });
    };



    componentDidUpdate(prevProps) {
        // Check if new data is different from previous data
        if (prevProps.topspinHighchartData !== this.props.topspinHighchartData) {
            const data = this.props.topspinHighchartData || [];

            // Check if there's no data and reset chart
            if (data.length === 0) {
                this.setState({
                    options: this.getMainChartOptions([]), // Pass empty array to render "No Data Found"
                    topspinHighchartDayData : []
                });
            } else {
                this.setState({
                    options: this.getMainChartOptions(data),
                    topspinHighchartDayData : []
                });
            }
        }

        // Reflow chart after the data changes
        if (this.chartComponent) {
            this.chartComponent.chart.reflow();
        }
    }


    render() {
        const chartStyle = {
            height: '400px',
            width: '100%',
        };

        return (
            <>
                <div className="">
                    <Card className="graph-dashboard-card card-custom">
                        <CardBody>
                            <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
                                <Tabs value={0} centered>
                                    <Tab label="Chair Results Analysis" />
                                </Tabs>

                                <Fragment>
                                    <Row>
                                        <Col xl={12}>
                                            {this.props.showGraph && (
                                            <div style={chartStyle}>
                                                    <HighchartsReact
                                                        ref={(chart) => { this.chartComponent = chart; }}
                                                        highcharts={Highcharts}
                                                        options={this.state.options}
                                                    />
                                            </div>
                                                )}

                                                {this.props.showGraph === false && (
                                                    <div style={{ textAlign: "center" }}>
                                                        <h4 className={"mt-5"}>{this.props.graphMessage}</h4>
                                                    </div>
                                                )}

                                        </Col>
                                    </Row>
                                </Fragment>
                            </Box>
                        </CardBody>
                    </Card>
                </div>

                <Modal
                    size="xl"
                    aria-labelledby="example-modal-sizes-title-lg"
                    backdrop="static"
                    style={{ maxHeight: "-webkit-fill-available" }}
                    dialogClassName="result-modal"
                    show={this.state.showModal}
                    onHide={this.handleCloseModal}

                >
                    <Modal.Header closeButton>
                        <Modal.Title>My Result Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="d-flex justify-content-center align-items-center">
                        <Row className="justify-content-center">
                        {this.state.modalData.map(item => {

                            const matchedCamera = this.props.cameraList.find(camera => camera.id === Number(item.camera_id));

                            return (
                                <Card
                                    style={{
                                        height: "100%", margin: "25px", maxWidth: "416px"
                                    }}
                                >
                                    <CardMedia
                                        style={{
                                            height: "351px"
                                        }}
                                        title={"Vioaltion"}
                                        alt={"Image Here"}
                                    >
                                        <Boundingbox
                                            className="row m-auto col-12 p-0 text-center"
                                            image={item?.image_url}
                                            boxes={item?.result?.detection.map((item) => ({
                                                coord: [
                                                    item.location[0], // x1
                                                    item.location[1], // y1
                                                    item.location[2] - item.location[0], // width
                                                    item.location[3] - item.location[1]  // height
                                                ],
                                                label: item.label
                                            })) || []}
                                            options={{
                                                colors: {
                                                    normal: "red", selected: "red", unselected: "red"
                                                }, style: {
                                                    maxWidth: "100%",
                                                    maxHeight: "100vh",
                                                    margin: "auto",
                                                    width: 520,
                                                    color: "red",
                                                    height: 354
                                                }
                                            }}
                                        />
                                    </CardMedia>
                                    <CardContent style={{minHeight: "100px"}}>
                                        <div
                                            className={"d-flex mt-1 mb-1 justify-content-between align-content-start"}
                                        >

                                            <div className={""}>
                                                <b>
                                                    {moment
                                                        .utc(item?.created_date?.$date)
                                                        .local()
                                                        .format("MMMM DD YYYY, h:mm:ss a")}
                                                </b>
                                            </div>
                                        </div>
                                        <div>
                                            <b>Camera Name: </b>
                                            {matchedCamera && <span>{matchedCamera.camera_name}</span>}
                                        </div>
                                        <div
                                            className={"d-flex mt-1 mb-1 justify-content-between align-content-start"}
                                        >
                          <span>
                          </span>
                                        </div>
                                        <div className={"mt-1 mb-1"}>
                                            {Object.entries(item?.counts || {}).map(([label, count]) => (
                                                <Chip
                                                    key={label}
                                                    label={`${label}: ${count}`} // Display label and count
                                                    style={{
                                                        borderRadius: "6px",
                                                        background: "#147b82",
                                                        color: "#fff",
                                                        fontWeight: "400",
                                                        fontSize: "16px",
                                                        // margin: "5px" // Add some spacing between chips
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )

                        })}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default TopspinDashboardOne;

export const colors = [
    '#147b82',
    '#5ca4a9',
    '#5c8aa8',
    '#d2784b',
    '#d1a654',
    '#a8546e',
    '#116065',
    '#7dc1c1',
    '#83aabc',
    '#b76e79',
    '#95d0d0',
    '#9fb7b9',
    '#cf9f96',
    '#cfb956',
    '#be7290',
    '#0f5e66',
    '#3b7071',
    '#2d8a9e'
];
