import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Button} from "reactstrap";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Boundingbox from "image-bounding-box-custom";
import {Col, Modal, Row, Table} from "react-bootstrap";
import * as moment from "moment";
import CardMedia from "@material-ui/core/CardMedia";
import {withStyles} from "@material-ui/core/styles";
import {clearPopupDataAction} from "../Locations/_redux/LocationAction";
import {connect} from "react-redux";

const styles = theme => ({
  card: {
    maxWidth: 416, height: "100%", margin: "auto"
  }, media: {
    height: 230
  }, header: {
    paddingBottom: "0rem"
  }, learnMore: {
    position: "absolute", bottom: 0
  }, cardCol: {
    height: 220, marginTop: 25, marginBottom: 15
  }
});

class DashboardTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: props.tableData || [], // Ensure tableData is initialized
      showBarTable: props.showBarTable,
      dashboardGraphName: props.dashboardGraphName,
      columns: null,
      data: [],
      viewImageModal: false,
      cameraData: props.cameraData || {}, // Ensure cameraData is initialized
      currentFrameIndex: 0, // Start with the first frame
      hovered:false,
      mousePosition:false,
    };
  }
  componentDidMount() {
    this.initializeColumns();
    this.getColumnsAndData();
  }


   handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    // setMousePosition({ x, y });
    this.setState({
      mousePosition : {x, y}
    })
  };

  initializeColumns = () => {
    const {currentFrameIndex, tableData} = this.state;
    const frame = tableData[currentFrameIndex]; // Get the current frame
    let columns = [];
    if(frame?.notification_type === 'anpr'){


    }
    else if (frame?.notification_type === 'tusker') {
      if (this.props.dashboardGraphName === "Label") {
        columns = [{dataField: "camera_name", text: "Camera"}, {
          dataField: "count",
          text: "Count"
        }, {dataField: "date", text: "Date"}, {dataField: "labels", text: "Labels"},];
      }
      else {
        columns = [{dataField: "event_name", text: "Event"}, {
          dataField: "event_type",
          text: "Event Type"
        }, {dataField: "event_desc", text: "Event Description"}, {
          dataField: "camera_name",
          text: "Camera Name"
        }, {dataField: "event_date", text: "Event Date"},];
      }
    }else {
      if (this.props.dashboardGraphName === "Label") {
        columns = [{dataField: "camera_name", text: "Camera"}, {
          dataField: "count",
          text: "Count"
        }, {dataField: "date", text: "Date"}, {dataField: "labels", text: "Labels"},];
      }
      else {
        columns = [{dataField: "event_name", text: "Event"}, {
          dataField: "event_type",
          text: "Event Type"
        }, {dataField: "event_desc", text: "Event Description"}, {
          dataField: "camera_name",
          text: "Camera Name"
        }, {dataField: "event_date", text: "Event Date"},];
      }
    }

    this.setState({columns});
  };

  getColumnsAndData = () => {
    const {currentFrameIndex, tableData, cameraData} = this.state;


    if (!tableData.length) return;

    const frame = tableData[currentFrameIndex]; // Get the current frame
    let data = [];

    if(frame?.notification_type === 'anpr'){
      const cameraValueID = cameraData.find((camera) => camera.value);
      const camera_name = cameraValueID?.label || "Unknown Camera";
      const full_image_url =frame?.full_image_url;
      const image_url =frame?.vehicle_data?.image_url;
      const number_plate = frame?.vehicle_data?.number_plate;
      const vehicle_type = frame?.vehicle_data?.vehicle_type;
      const owner_name = frame?.vehicle_data?.owner_name;
      const father_name = frame?.vehicle_data?.father_name;
      const rc_date = frame?.vehicle_data?.rc_date;
      const vehicle_year = frame?.vehicle_data?.vehicle_year;
      const notification_type = "anpr"

      data.push({camera_name, full_image_url,image_url ,number_plate,vehicle_type ,owner_name,father_name ,rc_date ,vehicle_year , notification_type});
    }
    else if (frame?.notification_type === 'tusker'){

      if (this.props.dashboardGraphName === "Label") {
        const cameraValueID = cameraData.find(cam => cam.value === Number(frame?.camera_id));
        const camera_name = cameraValueID?.label || "Unknown Camera";
        const count = frame?.result?.detection?.length || 0;
        const date = moment
            .utc(frame?.created_date?.$date)
            .local()
            .format("MMMM DD YYYY, h:mm:ss a");
        const labels = Object.keys(frame?.counts || {}).toString();
        const notification_type = "tusker"
        data.push({camera_name, count, date, labels ,notification_type});
      }
      else {
        const cameraValueID = cameraData.find((camera) => camera.value);
        const camera_name = cameraValueID?.label || "Unknown Camera";
        const event_name = frame?.event_name || "N/A";
        const event_desc = frame?.event_desc || "N/A";
        const event_type = frame?.event_type || "N/A";
        const event_date = moment
            .utc(frame?.event_date?.$date)
            .local()
            .format("MMMM DD YYYY, h:mm:ss a");
        const notification_type = "tusker"
        data.push({event_name, event_desc, event_type, camera_name, event_date ,notification_type});
      }
    }
    else {
      const cameraValueID = cameraData.find(cam => cam.value === Number(frame?.camera_id));
      const camera_name = cameraValueID?.label || "Unknown Camera";

      const count = frame?.result?.detection?.length || 0;
      const date = moment
          .utc(frame?.created_date?.$date)
          .local()
          .format("MMMM DD YYYY, h:mm:ss a");
      const labels = Object.keys(frame?.counts || {}).toString();
      data.push({camera_name, count, date, labels});
    }

    this.setState({data});
  };

  handleNextFrame = () => {
    this.setState((prevState) => ({
          currentFrameIndex: Math.min(prevState.currentFrameIndex + 1, prevState.tableData.length - 1),
        }), this.getColumnsAndData // Update data after changing frame
    );
  };

  handlePrevFrame = () => {
    this.setState((prevState) => ({
          currentFrameIndex: Math.max(prevState.currentFrameIndex - 1, 0),
        }), this.getColumnsAndData // Update data after changing frame
    );
  };

  handleCloseModal = () => {
    this.props.clearPopupDataAction()
    this.setState({showBarTable: false});
  };

  render() {
    const {user} = this.props;
    const {columns, data, currentFrameIndex, tableData} = this.state;
    return (<Modal
        size="lg"
        show={this.state.showBarTable}
        onHide={this.handleCloseModal}
        dialogClassName="result-modal"
    >
      <Modal.Header closeButton>
        <h3>
          {this.props.dashboardGraphName === "Label" ? "My Result Details" : "My Result Details"}
        </h3>
      </Modal.Header>
      <Modal.Body>

        {tableData[currentFrameIndex].notification_type === "tusker" ? (
            <>
              {data.length > 0 ? (
                  <BootstrapTable
                      bootstrap4
                      keyField="id"
                      data={data}
                      columns={columns}
                      bordered={false}
                      wrapperClasses="table-responsive"
                  />
              ) : (
                  <p>No data available</p>
              )}

              {this.props.dashboardGraphName === "Label" ? (
                  <TransformWrapper defaultScale={1} defaultPositionX={200} defaultPositionY={100}>
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                          <div className="tools" style={{ width: "100%", marginBottom: "4px" }}>
                            <ButtonGroup size="small" aria-label="Small outlined button group" style={{ width: "100%" }}>
                              <div className="d-flex align-items-center justify-content-between" style={{ width: "100%" }}>
                                {/* Left group */}
                                <span className="d-flex gap-2">
                    <Button onClick={zoomIn} style={{ marginRight: "4px" }}>+</Button>
                    <Button onClick={zoomOut} style={{ marginRight: "4px" }}>-</Button>
                    <Button onClick={resetTransform} style={{ marginRight: "4px" }}>reset</Button>
                  </span>

                                {/* Right group */}
                                <span className="d-flex gap-2">
                    <Button
                        disabled={currentFrameIndex === 0}
                        onClick={this.handlePrevFrame}
                        style={{ marginRight: "4px" }}
                    >
                      &lt;
                    </Button>

                    <Button
                        disabled={currentFrameIndex === tableData.length - 1}
                        onClick={this.handleNextFrame}
                    >
                      &gt;
                    </Button>
                  </span>
                              </div>
                            </ButtonGroup>
                          </div>

                          <div className="boundimage-full w-100" style={{ margin: "0 auto" }}>
                            <TransformComponent>
                              <Boundingbox
                                  key={currentFrameIndex}
                                  className="row m-auto col-12 p-0 text-center"
                                  image={tableData[currentFrameIndex]?.image_url}
                                  boxes={tableData[currentFrameIndex]?.result?.detection.map(d => ({
                                    coord: [d.location[0], d.location[1], d.location[2] - d.location[0], d.location[3] - d.location[1]],
                                    label: user.user_email !== "fieldai_admin@tusker.ai" && d.label,
                                  }))}
                                  showLabels={false}
                                  options={{
                                    colors: { normal: "red", selected: "red", unselected: "red" },
                                    style: { maxWidth: "100%", maxHeight: "90vh", margin: "auto", width: 752, color: "red", height: 470 },
                                  }}
                              />
                            </TransformComponent>
                          </div>
                        </>
                    )}
                  </TransformWrapper>
              ) : (
                  <>
                    {tableData[currentFrameIndex]?.image_list && tableData[currentFrameIndex]?.image_list.length > 0 ? (
                        <Row>
                          {[0, tableData[currentFrameIndex]?.image_list.length - 1].map(index => (
                              <Col xl={6} md={6} sm={12} lg={6} key={index}>
                                <TransformWrapper defaultScale={1} defaultPositionX={200} defaultPositionY={100}>
                                  {({ zoomIn, zoomOut, resetTransform }) => (
                                      <>
                                        <div className="tools" style={{ width: "100%", marginBottom: "4px" }}>
                                          <ButtonGroup size="small" aria-label="Small outlined button group">
                                            <Button onClick={zoomIn}>+</Button>
                                            <Button onClick={zoomOut}>-</Button>
                                            <Button onClick={resetTransform}>reset</Button>
                                          </ButtonGroup>
                                        </div>
                                        <div className="boundimage-full w-100" style={{ margin: "0 auto" }}>
                                          <TransformComponent>
                                            <div className="mt-5 mb-5">
                                              <CardMedia
                                                  style={{ cursor: "pointer" }}
                                                  alt={`Image ${index + 1}`}
                                              >
                                                <Boundingbox
                                                    key={currentFrameIndex}
                                                    className="row m-auto col-12 p-0 text-center"
                                                    image={
                                                        tableData[currentFrameIndex]?.image_list[index]?.imageUrl ||
                                                        tableData[currentFrameIndex]?.image_list[index]
                                                    }
                                                    options={{
                                                      colors: { normal: "red", selected: "red", unselected: "red" },
                                                      style: { maxWidth: "100%", maxHeight: "100vh", margin: "auto", width: "100vw", color: "red", height: 510 },
                                                    }}
                                                />
                                              </CardMedia>
                                            </div>
                                          </TransformComponent>
                                        </div>
                                      </>
                                  )}
                                </TransformWrapper>
                              </Col>
                          ))}
                        </Row>
                    ) : null}
                  </>
              )}
            </>
        ) : tableData[currentFrameIndex].notification_type === "anpr" ? (
            <>
              <Row>
                <div className="tools" style={{ width: "100%", marginBottom: "4px" }}>
                  <ButtonGroup size="small" aria-label="Small outlined button group" style={{ width: "100%" }}>
                    <div className="d-flex align-items-center justify-content-between" style={{ width: "100%" }}>
                      {/* Left group */}
                      <span className="d-flex gap-2">
                  </span>

                      {/* Right group */}
                      <span className="d-flex gap-2">
                    <Button
                        disabled={currentFrameIndex === 0}
                        onClick={this.handlePrevFrame}
                        style={{ marginRight: "4px" }}
                    >
                      &lt;
                    </Button>

                    <Button
                        disabled={currentFrameIndex === tableData.length - 1}
                        onClick={this.handleNextFrame}
                    >
                      &gt;
                    </Button>
                  </span>
                    </div>
                  </ButtonGroup>
                </div>
              </Row>
              <Row>
                <Col md={6} className="d-flex flex-column align-items-center">
                  {tableData[currentFrameIndex]?.full_image_url ? (
                      <div
                          className="overflow-hidden border p-2 position-relative"
                          style={{ width: "100%", height: "auto" }}
                          onMouseEnter={() => this.setState({
                            hovered: true,
                          })}
                          onMouseLeave={() => this.setState({
                            hovered: false,
                          })}
                          onMouseMove={this.handleMouseMove}
                      >
                        <img
                            src={tableData[currentFrameIndex]?.full_image_url}
                            alt="Violation"
                            className="w-100"
                            style={{
                              height: "420px",
                              transform: this.state.hovered ? `scale(2)` : "scale(1)",
                              transformOrigin: `${this.state.mousePosition.x}% ${this.state.mousePosition.y}%`,
                              transition: "transform 0.2s ease-in-out",
                            }}
                        />
                      </div>
                  ) : (
                      <h5>No Data Found</h5>
                  )}
                </Col>
                <Col md={6}
                     className={`${Object.keys(tableData[currentFrameIndex]?.vehicle_data).length > 0
                         ? 'border-right d-flex flex-column justify-content-center'
                         : 'border-right d-flex flex-column justify-content-around'}`}>
                  {tableData[currentFrameIndex]?.vehicle_data && Object.keys(tableData[currentFrameIndex]?.vehicle_data).length > 0 ? (
                      <Table bordered size="sm">
                        <tbody>
                        <tr>
                          <td><b>Owner Image:</b></td>
                          <td>
                            {tableData[currentFrameIndex]?.vehicle_data?.image_url ?
                            <img
                                src={tableData[currentFrameIndex]?.vehicle_data?.image_url}
                                alt="Violation"
                                width={150}
                                height={150}
                            /> : "-" }
                          </td>
                        </tr>
                        <tr>
                          <td><b>Number Plate Image:</b></td>
                          <td>
                            <div
                                className="overflow-hidden border p-2 position-relative"
                                style={{ width: "100%", height: "auto" }}
                            >
                              <img
                                  src={tableData[currentFrameIndex]?.plate_image_url}
                                  alt="Plate"
                                  className="w-100"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td><b>Number Plate:</b></td>
                          <td>{tableData[currentFrameIndex]?.vehicle_data?.number_plate || '-'}</td>
                        </tr>
                        <tr>
                          <td><b>Speed:</b></td>
                          <td style={{color : 'red'}}>{tableData[currentFrameIndex]?.speed}</td>
                        </tr>
                        <tr>
                          <td><b>Vehicle Type:</b></td>
                          <td>{tableData[currentFrameIndex]?.vehicle_data?.vehicle_type || '-'}</td>
                        </tr>
                        <tr>
                          <td><b>Owner Name:</b></td>
                          <td>{tableData[currentFrameIndex]?.vehicle_data?.owner_name || '-'}</td>
                        </tr>
                        <tr>
                          <td><b>Number Direction:</b></td>
                          <td>{tableData[currentFrameIndex]?.vehicle_data?.number_plate || '-'}</td>
                        </tr>
                        <tr>
                          <td><b>Father's Name:</b></td>
                          <td>{tableData[currentFrameIndex]?.vehicle_data?.father_name || '-'}</td>
                        </tr>
                        <tr>
                          <td><b>RC Date:</b></td>
                          <td>{new Date(tableData[currentFrameIndex]?.vehicle_data?.rc_date).toLocaleDateString() || '-'}</td>
                        </tr>
                        <tr>
                          <td><b>Vehicle Year:</b></td>
                          <td>{tableData[currentFrameIndex]?.vehicle_data?.vehicle_year || '-'}</td>
                        </tr>
                        </tbody>
                      </Table>
                  ) : (
                      <>
                        <Table bordered size="sm" className={'mb-5'}>
                          <tbody>
                          <tr>
                            <td><b>Number Plate Image:</b></td>
                            <td>
                              <div
                                  className="overflow-hidden border p-2 position-relative"
                                  style={{ width: "100%", height: "auto" }}
                              >
                                <img
                                    src={tableData[currentFrameIndex]?.plate_image_url}
                                    alt="Plate"
                                    className="w-100"
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td><b>Number Plate:</b></td>
                            <td>{tableData[currentFrameIndex]?.plate || '-'}</td>
                          </tr>
                          <tr>
                            <td><b>Speed:</b></td>
                            <td style={{color : 'red'}}>{tableData[currentFrameIndex]?.speed}</td>
                          </tr>
                          </tbody>
                        </Table>
                        <h5 className="text-center w-100">No Matching Data Found,<br/>Please Check Your Vehicle Details Entry!</h5>
                      </>

                  )}
                </Col>
              </Row>
            </>
        ) :
        <>

          {data.length > 0  ? (
              <BootstrapTable
              bootstrap4
              keyField="id"
              data={data}
              columns={columns}
              bordered={false}
              wrapperClasses="table-responsive"
          />) : (<p>No data available</p>)}

          {this.props.dashboardGraphName === "Label" ? (
              <TransformWrapper
              defaultScale={1}
              defaultPositionX={200}
              defaultPositionY={100}
          >
            {({zoomIn, zoomOut, resetTransform, ...rest}) => (<React.Fragment>
              <div
                  className="tools"
                  style={{width: "100%", marginBottom: "4px"}}
              >
                <ButtonGroup
                    size="small"
                    aria-label="Small outlined button group"
                    style={{width: "100%"}}
                >
                  <div className="d-flex align-items-center justify-content-between"
                       style={{width: "100%"}}>
                    {/* Left group */}
                    <span className="d-flex gap-2">
                                                    <Button onClick={zoomIn} style={{ marginRight: "4px" }}>+</Button>
                                                    <Button onClick={zoomOut} style={{ marginRight: "4px" }}>-</Button>
                                                    <Button onClick={resetTransform} style={{ marginRight: "4px" }}>reset</Button>
                                                </span>

                    {/* Right group */}
                    <span className="d-flex gap-2">
                                                    <Button
                                                        disabled={currentFrameIndex === 0}
                                                        onClick={this.handlePrevFrame}
                                                        style={{ marginRight: "4px" }}
                                                    >
                                                        &lt;
                                                    </Button>

                                                    <Button
                                                        disabled={currentFrameIndex === tableData.length - 1}
                                                        onClick={this.handleNextFrame}
                                                    >
                                                        &gt;
                                                    </Button>
                                                </span>
                  </div>
                </ButtonGroup>
              </div>

              <div
                  className="boundimage-full w-100"
                  style={{margin: "0 auto"}}
              >
                <TransformComponent>
                  <Boundingbox

                      key={currentFrameIndex}
                      className="row m-auto col-12 p-0 text-center"
                      image={tableData[currentFrameIndex]?.image_url}
                      boxes={tableData[currentFrameIndex]?.result?.detection.map(d => ({
                        coord: [d.location[0], d.location[1], d.location[2] - d.location[0], d.location[3] - d.location[1]],
                        label: user.user_email !== 'fieldai_admin@tusker.ai' && d.label
                      }))}
                      showLabels={false}
                      options={{
                        colors: {
                          normal: "red", selected: "red", unselected: "red"
                        }, style: {
                          maxWidth: "100%",
                          maxHeight: "90vh",
                          margin: "auto",
                          width: 752,
                          color: "red",
                          height: 470
                        }
                      }}
                  />
                </TransformComponent>
              </div>
            </React.Fragment>)}
          </TransformWrapper>) :
              (
              <>

            {tableData[currentFrameIndex]?.image_list && tableData[currentFrameIndex]?.image_list ?
                <Row>
                  <Col xl={6} md={6} sm={12} lg={6}>
                    <TransformWrapper defaultScale={1} defaultPositionX={200}
                                      defaultPositionY={100}>
                      {({zoomIn, zoomOut, resetTransform, ...rest}) => (<React.Fragment>
                        <div className="tools"
                             style={{width: "100%", marginBottom: "4px"}}>
                          <ButtonGroup size="small"
                                       aria-label="Small outlined button group">
                            <Button onClick={zoomIn}>+</Button>
                            <Button onClick={zoomOut}>-</Button>
                            <Button onClick={resetTransform}>reset</Button>
                          </ButtonGroup>
                        </div>
                        <div
                            className="boundimage-full w-100"
                            style={{margin: "0 auto"}}
                        >
                          <TransformComponent>
                            <div className={"mt-5 mb-5"}>
                              <CardMedia
                                  style={{cursor: "pointer"}}
                                  // className={classes.media}
                                  alt={"Image Here 1"}
                                  // onClick={modalOpen}
                              >
                                <Boundingbox

                                    key={currentFrameIndex}
                                    className="row m-auto col-12 p-0 text-center"
                                    image={tableData[currentFrameIndex]?.image_list[0]?.imageUrl ? tableData[currentFrameIndex]?.image_list[0]?.imageUrl : tableData[currentFrameIndex]?.image_list[0]}
                                    options={{
                                      colors: {
                                        normal: "red",
                                        selected: "red",
                                        unselected: "red"
                                      }, style: {
                                        maxWidth: "100%",
                                        maxHeight: "100vh",
                                        margin: "auto",
                                        width: "100vw", // width: 358,
                                        color: "red",
                                        height: 510
                                      }
                                    }}
                                />

                              </CardMedia>
                            </div>
                          </TransformComponent>
                        </div>
                      </React.Fragment>)}
                    </TransformWrapper>
                  </Col>
                  <Col xl={6} md={6} sm={12} lg={6}>
                    <TransformWrapper defaultScale={1} defaultPositionX={200}
                                      defaultPositionY={100}>
                      {({zoomIn, zoomOut, resetTransform, ...rest}) => (<React.Fragment>
                        <div
                            className="tools"
                            style={{width: "100%", marginBottom: "4px"}}
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
                            style={{margin: "0 auto"}}
                        >
                          <TransformComponent>
                            <div className={"mt-5 mb-5"}>
                              <CardMedia
                                  style={{cursor: "pointer"}}
                                  alt={"Image Here 1"}
                              >
                                <Boundingbox

                                    key={currentFrameIndex}
                                    className="row m-auto col-12 p-0 text-center"
                                    image={tableData[currentFrameIndex]?.image_list[tableData[currentFrameIndex]?.image_list.length - 1]?.imageUrl ? tableData[currentFrameIndex]?.image_list[tableData[currentFrameIndex]?.image_list.length - 1]?.imageUrl : tableData[currentFrameIndex]?.image_list[tableData[currentFrameIndex]?.image_list.length - 1]}
                                    options={{
                                      colors: {
                                        normal: "red",
                                        selected: "red",
                                        unselected: "red"
                                      }, style: {
                                        maxWidth: "100%",
                                        maxHeight: "100vh",
                                        margin: "auto",
                                        width: "100vw", // width: 358,
                                        color: "red",
                                        height: 510
                                      }
                                    }}
                                />

                              </CardMedia>
                            </div>
                          </TransformComponent>
                        </div>
                      </React.Fragment>)}
                    </TransformWrapper>
                  </Col>
                </Row> : <></>}

          </>)}
        </>}
      </Modal.Body>

      <Modal.Footer>
        <Row className="w-100">
          <Col xs={6}>
              <span>
                Frame {currentFrameIndex + 1} of {tableData.length}
              </span>
          </Col>
          <Col xs={6} className="text-right">
            <Button
                type="button"
                onClick={this.handleCloseModal}
                className="btn btn-secondary ml-2"
            >
              Close
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>);
  }
}
const mapDispatchToProps = {
  clearPopupDataAction
};


// export default withStyles(styles)(DashboardTable);
export default connect(null,mapDispatchToProps)(withStyles(styles)(DashboardTable));
