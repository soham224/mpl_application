import React, { Component, Fragment } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap";
import Select from "react-select";
import RegionPlot1 from "./regionPlot1";
import { loadImageFromRtspURL } from "./_redux";
import { warningToast } from "../../../../utils/ToastMessage";
// eslint-disable-next-line

export default class SelectCameraPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      options: [],
      selectedModal: "",
      imagePath: "",
      cameraParam: ""
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let totalCamera = nextProps.totalCameras;
    let options = [];
    for (let y = 0; y < totalCamera?.length; y++) {
      let data = totalCamera[y];

      options.push({
        value: data.id + "-" + data.rtsp_url + "-" + data.roi_type, // here it will be image url
        label: data.camera_name
      });
    }
    this.setState({
      selectedModal: "",
      options: options,
      modalOpen: nextProps.openModal
    });
  }

  handleModalChange = selectedModal => {
    this.setState({
      selectedModal,
      showRoITab: false
    });
    setTimeout(() => {
      let selectedOption = selectedModal.value.split("-");
      let param = {
        id: selectedOption[0],
        camera_name: selectedModal.label,
        rtsp_url: selectedOption[1]
      };
      let allData = {
        id: selectedOption[0],
        camera_name: selectedModal.label,
        rtsp_url: selectedOption[1],
        roi_type: selectedOption[2]
      };

      this.setState({
        cameraParam: allData
        // showRoITab: true
      });
      loadImageFromRtspURL(param)
        .then(response => {
          this.setState({
            imagePath: response.data.file,
            showRoITab: true
          });
        })
        .catch(error => {
          if (error.detail) {
            warningToast(error.detail);
          } else {
            warningToast("Something went Wrong");
          }
        });
    }, 500);
  };

  render() {
    return (
      <Fragment>
        <Modal
          isOpen={this.state.modalOpen}
          size={"lg"}
          toggle={() => this.props.setOpenROIModal(false)}
          backdrop="static"
        >
          <ModalHeader>
            <div style={{ width: "100%", float: "left" }}>
              <h2>Image plot</h2>
            </div>
          </ModalHeader>
          <ModalBody>
            <Card>
              <CardBody>
                <Row>
                  <Col xl={12}>
                    <div className="overlay overlay-block cursor-default p-0">
                      <Select
                        className="align-left"
                        theme={theme => ({
                          ...theme,
                          borderRadius: 0,
                          colors: {
                            ...theme.colors,
                            primary25: "#5DBFC4",
                            primary: "#147b82"
                          }
                        })}
                        placeholder="Select Camera"
                        value={this.state.selectedModal}
                        onChange={this.handleModalChange}
                        options={this.state.options}
                      />
                      <hr />
                      {this.state.selectedModal && this.state.showRoITab && (
                        <>
                          {console.log("this.props.setOpenROIModal" ,this.props.setOpenROIModal ,this.state.cameraParam,
                              this.state.imagePath)}
                          <RegionPlot1
                            setOpenROIModal={this.props.setOpenROIModal}
                            cameraParam={this.state.cameraParam}
                            imagePath={this.state.imagePath}
                          />
                        </>
                      )}
                      {this.state.selectedModal && !this.state.showRoITab && (
                        <>
                          <div className="overlay-layer bg-transparent mt-3">
                            <div className="spinner spinner-lg spinner-success" />
                          </div>
                          <div className="w-100 text-center">
                            <b
                              className="d-block"
                              style={{ paddingTop: "30px", marginLeft: "10px" }}
                            >
                              Loading image from rtsp stream
                            </b>
                          </div>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => this.props.setOpenROIModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}
