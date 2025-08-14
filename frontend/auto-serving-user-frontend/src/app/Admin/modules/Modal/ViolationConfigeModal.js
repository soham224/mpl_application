import React, { Component, Fragment } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import { Col, Row } from "reactstrap";
import {
  addViolationSetting,
  getModelLabels,
  updateViolationSetting
} from "../Violation/_redux/ViolationAPI";
import { successToast, warningToast } from "../../../../utils/ToastMessage";
import { connect } from "react-redux";
import * as auth from "../Auth";
import TextField from "@material-ui/core/TextField";
import moment from "moment";

class ViolationConfigeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen,
      isUpdate: props.isUpdate,
      data: props.data[0],
      start_time: "10:30",
      end_time: "19:30",
      isMailReceived: "",
      errors: {},
      msg: {},
      dropdownList: "",
      userId: props.userId,
      created_date: "",
      updated_date: "",
      selectedType: [],
      id: props.settings.id
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.isUpdate) {
      this.setState({
        isOpen: nextProps.isOpen,
        data: nextProps.data[0],
        start_time: moment
          .utc(nextProps.settings["start_time"], "HH:mm")
          .local()
          .format("HH:mm"),
        end_time: moment
          .utc(nextProps.settings["end_time"], "HH:mm")
          .local()
          .format("HH:mm"),
        isMailReceived: nextProps.settings["isMailReceived"],
        userId: nextProps.userId,
        isUpdate: nextProps.isUpdate,
        selectedLabel: nextProps.settings["label"].split(","),
        id: nextProps.settings.id,
        errors: {}
      });
      let valueLables = nextProps.settings.label.split(",");
      let selectedOpt = [];
      for (let i = 0; i < this.state.labelOptions.length; i++) {
        let option = this.state.labelOptions[i];
        if (valueLables.includes(option.value)) {
          selectedOpt.push(option);
        }
      }
      this.setState({
        selectedType: selectedOpt
      });
    } else {
      this.setState({
        isOpen: nextProps.isOpen,
        userId: nextProps.userId
      });
    }
  }

  checkErrors = () => {
    const { start_time, end_time, errors, msg } = this.state;
    if (start_time === "" || start_time === null) {
      errors["start_time"] = true;
      msg["start_time"] = "This field is required";
      this.setState({
        errors: errors,
        msg: msg
      });
    }
    if (end_time === "" || end_time === null) {
      errors["end_time"] = true;
      msg["end_time"] = "This field is required";
      this.setState({
        errors: errors,
        msg: msg
      });
    }
    if (
      start_time !== "" ||
      end_time !== "" ||
      start_time !== null ||
      end_time !== null
    ) {
      let stTime = start_time.split(":");
      let edTime = end_time.split(":");
      if (parseInt(stTime[0]) > parseInt(edTime[0])) {
        errors["timeDiff"] = true;
        msg["timeDiff"] = "Start time must be smaller than End time";
        warningToast("Start time must be smaller than End time");
        this.setState({
          errors: errors,
          msg: msg
        });
      } else if (parseInt(stTime[0]) === parseInt(edTime[0])) {
        if (parseInt(stTime[1]) >= parseInt(edTime[1])) {
          errors["timeDiff"] = true;
          msg["timeDiff"] = "Start time must be smaller than End time";
          warningToast("Start time must be smaller than End time");
          this.setState({
            errors: errors,
            msg: msg
          });
        }
      }
    }
    return errors;
  };

  handleChange(e) {
    let errors = this.state.errors;
    const name = e.target.name;
    if (name === "start_time" || name === "end_time") {
      errors["timeDiff"] = false;
    }
    errors[name] = false;
    this.setState({
      [name]: e.target.value,
      errors: errors
    });
  }

  generateOptions = array => {
    let options = [];
    for (let y = 0; y < array.length; y++) {
      let data = array[y];
      options.push({
        value: data,
        label: data
      });
    }
    return options;
  };
  handleTypeChange = selectedType => {
    this.setState({
      selectedType
    });
  };

  getLabelsDropDown = () => {
    this.setState({ blocking: true });
    let userRole = this.state.userRole;
    getModelLabels(userRole)
      .then(res => {
        if (res && res.isSuccess) {
          let sepratedList = [];
          res.data.map((item, index) => {
            if (item.includes(",")) {
              let l = item.split(",");
              sepratedList.push(...l);
            } else {
              sepratedList.push(item);
            }
            return null;
          });
          let abc = this.generateOptions(sepratedList);
          this.setState(
            {
              blocking: false
            },
            () => {
              this.setState({
                labelOptions: abc
              });
            }
          );
        } else {
          this.setState({ blocking: false });
          warningToast("Something went wrong");
        }
      })
      .catch(err => {
        this.setState({ blocking: false });
      });
  };

  addNewLabels = () => {
    this.setState({ blocking: true });
    let errors = this.checkErrors();
    if (!Object.values(errors).includes(true)) {
      let str = "";
      // eslint-disable-next-line
      this.state.selectedType.map(x => {
        str = x.value + "," + str;
      });
      if (!this.state.isUpdate) {
        let body = {
          label: str.slice(0, str.length - 1),
          company_id: this.state.userId,
          status: true,
          isMailReceived: false,
          start_time: new Date(
            new Date().getFullYear() +
              "-" +
              (new Date().getMonth() + 1) +
              "-" +
              new Date().getDate() +
              " " +
              this.state.start_time
          )
            .toISOString()
            .split("T")[1]
            .toString()
            .substring(0, 5),
          end_time: new Date(
            new Date().getFullYear() +
              "-" +
              (new Date().getMonth() + 1) +
              "-" +
              new Date().getDate() +
              " " +
              this.state.end_time
          )
            .toISOString()
            .split("T")[1]
            .toString()
            .substring(0, 5),
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        };
        addViolationSetting(body)
          .then(res => {
            if (res && res.isSuccess) {
              this.setState({ blocking: false });
              successToast("Successfully added settings");
              this.props.onUpdate();
              this.props.onHide();
            } else {
              this.setState({ blocking: false });
              warningToast("Something went wrong");
            }
          })
          .catch(err => {
            this.setState({ blocking: false });
          });
      } else {
        let body = {
          label: str.slice(0, str.length - 1),
          company_id: this.state.userId,
          isMailReceived: this.state.isMailReceived,
          start_time: new Date(
            new Date().getFullYear() +
              "-" +
              (new Date().getMonth() + 1) +
              "-" +
              new Date().getDate() +
              " " +
              this.state.start_time
          )
            .toISOString()
            .split("T")[1]
            .toString()
            .substring(0, 5),
          end_time: new Date(
            new Date().getFullYear() +
              "-" +
              (new Date().getMonth() + 1) +
              "-" +
              new Date().getDate() +
              " " +
              this.state.end_time
          )
            .toISOString()
            .split("T")[1]
            .toString()
            .substring(0, 5),
          status: true,
          id: this.state.id,
          updated_date: new Date().toISOString()
        };
        updateViolationSetting(body)
          .then(res => {
            if (res && res.isSuccess) {
              this.setState({ blocking: false });
              successToast("Successfully updated settings");
              this.props.onUpdate();
              this.props.onHide();
            } else {
              this.setState({ blocking: false });
              warningToast("Something went wrong");
            }
          })
          .catch(err => {
            this.setState({ blocking: false });
          });
      }
    }
  };

  componentDidMount() {
    const { user } = this.props;
    let userRole = user.roles[0].role;
    this.setState(
      {
        userRole: userRole
      },
      () => {
        this.getLabelsDropDown();
      }
    );
  }

  render() {
    return (
      <Fragment>
        <Modal
          size="lg"
          show={this.state.isOpen}
          onHide={this.props.onHide}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Violation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-2 mb-2">
              <div className="col col-md-3">
                <span>
                  <b>Labels</b>
                </span>
              </div>

              <div className="col col-md-9">
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
                  placeholder="Select Type"
                  isMulti={true}
                  isSearchable={false}
                  value={this.state.selectedType}
                  onChange={this.handleTypeChange}
                  options={this.state.labelOptions}
                />
              </div>
            </div>

            <div className="row mt-1 mb-2">
              <div className="col col-md-3">
                <span>
                  <b>Start Time</b>
                </span>
              </div>
              <div className="col col-md-9">
                <TextField
                  id="time"
                  type="time"
                  name={"start_time"}
                  value={this.state.start_time}
                  onChange={e => this.handleChange(e)}
                  inputProps={{
                    step: 60 // 1 min
                  }}
                />
              </div>
            </div>
            <br />

            <div className="row mt-1 mb-2">
              <div className="col col-md-3">
                <span>
                  <b>End Time</b>
                </span>
              </div>
              <div className="col col-md-9">
                <TextField
                  id="time"
                  type="time"
                  name={"end_time"}
                  value={this.state.end_time}
                  onChange={e => this.handleChange(e)}
                  inputProps={{
                    step: 60, // 1 min
                    format: "hh:mm a"
                  }}
                />
              </div>
            </div>
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Row className={"m-0"} style={{ width: "100%" }}>
              <Col className={"p-0"} xl={12}>
                <div style={{ width: "100%", textAlign: "end" }}>
                  <Button
                    type="button"
                    onClick={this.props.onHide}
                    className="btn btn-light btn-elevate"
                  >
                    Cancel
                  </Button>
                  <> </>
                  <Button
                    type="submit"
                    className="btn btn-primary btn-elevate"
                    onClick={this.addNewLabels}
                  >
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { auth } = state;
  return { user: auth.user };
}

export default connect(mapStateToProps, auth.actions)(ViolationConfigeModal);
