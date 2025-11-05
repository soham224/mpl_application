import React, { Component, Fragment } from "react";
import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Input,
} from "reactstrap";
import Select from "react-select";
import {
  assignLocationToSupervisor,
  deleteUserLocationById,
  getEnabledLocationList,
} from "../AddSupervisor/_redux";
import { successToast, warningToast } from "../../../../utils/ToastMessage";
import { addNotification } from "../Notification/_redux/notification";
import { connect } from "react-redux";
import * as auth from "../Auth";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

class AssignLocationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: props.modalOpen,
      specific_user_id: props.specific_user_id,
      locationOptions: [],
      selectedLocationList: [],
      user_id: props.selectedUser.id,
      user_email: props.selectedUser.email,
      user_selected_location: props.selectedUserLocation,
      selectedLocation: [],
      blocking: false,
    };
  }

  componentDidMount() {
    this.populateLocationList();
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      modalOpen: nextProps.modalOpen,
      user_id: nextProps.selectedUser.id,
      specific_user_id: nextProps.specific_user_id,
      user_email: nextProps.selectedUser.email,
      user_selected_location: nextProps.selectedUserLocation,
    });
    if (nextProps.modalOpen) {
      this.getCurrentUserLocationList();
    }
  }

  getCurrentUserLocationList = () => {
    let user_selected_location = this.state.user_selected_location;
    if (user_selected_location && user_selected_location.length > 0) {
      let selectedLocationArray = [];
      for (let i = 0; i < user_selected_location.length; i++) {
        selectedLocationArray.push(user_selected_location[i].value);
      }
      this.setState({
        selectedLocation: user_selected_location,
        selectedLocationList: selectedLocationArray,
      });
    } else {
      this.setState({
        selectedLocation: [],
        selectedLocationList: [],
      });
    }
  };

  populateLocationList = () => {
    getEnabledLocationList().then((response) => {
      // eslint-disable-next-line
      if (response && response.data) {
        let list = this.generateOptions(response.data);
        this.setState({
          locationOptions: list,
        });
      }
    });
  };

  handleLocationChange = (selectedLocation) => {
    let selectedLocationArray = [];

    let difference = this.state.selectedLocation?.filter(
      (x) => !selectedLocation?.includes(x)
    );

    if (difference && difference.length > 0) {
      let params = {
        location_list: [difference[0].value],
      };
      this.setState({
        selectedLocation,
        selectedLocationList: selectedLocationArray,
      });
      const { user } = this.props;
      if (this.props.selectedUserLocation.includes(difference[0])) {
        this.setState({
          blocking: true,
        });
        deleteUserLocationById(params, this.state.specific_user_id)
          .then((response) => {
            this.setState({
              blocking: false,
            });
            if (response && response.isSuccess) {
              if (selectedLocation) {
                for (let i = 0; i < selectedLocation.length; i++) {
                  selectedLocationArray.push(selectedLocation[i].value);
                }
              }
              this.setState({
                selectedLocation,
                selectedLocationList: selectedLocationArray,
              });
              let deletedLocation = difference[0].label;
              let data = {
                notification_message:
                  "Assign Location Deleted: " + deletedLocation,
                user_id: user.id,
                type_of_notification: "string",
                status: true,
                is_unread: true,
              };
              addNotification(data).then((response) => {
                if (response && response.isSuccess) {
                  successToast("Assign Location Deleted Successful");
                }
              });
            } else {
              warningToast("Something went wrong");
            }
          })
          .catch((error) => {
            if (error.detail) {
              warningToast(error.detail);
            } else {
              warningToast("Something went Wrong");
            }
            this.setState({
              blocking: false,
            });
          });
      } else {
        if (selectedLocation) {
          for (let i = 0; i < selectedLocation.length; i++) {
            selectedLocationArray.push(selectedLocation[i].value);
          }
        }
        this.setState({
          selectedLocation,
          selectedLocationList: selectedLocationArray,
        });
      }
    } else {
      if (selectedLocation) {
        for (let i = 0; i < selectedLocation.length; i++) {
          selectedLocationArray.push(selectedLocation[i].value);
        }
      }
      this.setState({
        selectedLocation,
        selectedLocationList: selectedLocationArray,
      });
    }
  };

  assignLocation = () => {
    let parameters = {
      location_list: this.state.selectedLocationList,
    };
    if (
      this.state.selectedLocationList &&
      this.state.selectedLocationList.length > 0
    ) {
      assignLocationToSupervisor(parameters, this.state.specific_user_id).then(
        (response) => {
          const { user } = this.props;
          if (response && response.isSuccess) {
            this.props.blockAddSupervisor();
            this.props.toggleLocationModal();

            let addedLocation = "";
            for (let i = 0; i < this.state.selectedLocation.length; i++) {
              let obj = this.state.selectedLocation[i];
              addedLocation = addedLocation + " " + obj.label;
            }

            let data = {
              notification_message: " Assign Location Added: " + addedLocation,
              user_id: user.id,
              type_of_notification: "string",
              status: true,
              is_unread: true,
            };
            addNotification(data).then((response) => {
              if (response && response.isSuccess) {
                successToast("Assign Location Added Successful");
              }
            });
          } else {
            warningToast("Something went wrong");
          }
        }
      );
    } else {
      warningToast("Please fill required fields");
    }
  };

  generateOptions = (array) => {
    let options = [];
    for (let y = 0; y < array.length; y++) {
      let data = array[y];
      let replaced = data.location_name;
      let id = data.id;
      options.push({
        value: id,
        label: replaced,
      });
    }
    return options;
  };

  render() {
    const { locationOptions, selectedLocation, user_email } = this.state;

    return (
      <Fragment>
        <Modal
          isOpen={this.state.modalOpen}
          toggle={this.props.toogleSupervisorModal}
          backdrop="static"
        >
          <BlockUi tag="div" blocking={this.state.blocking} color="#147b82">
            <ModalHeader>
              <div style={{ width: "100%", float: "left" }}>
                <h2>Assign Location</h2>
              </div>
            </ModalHeader>
            <ModalBody>
              <Label for="user_email">User Email</Label>
              <Input
                disabled={true}
                type="user_email"
                value={user_email}
                name="user_email"
              />

              <Label className={"mt-2"} for="assign_location">
                Assign Location *
              </Label>
              <Select
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82",
                  },
                })}
                isMulti={true}
                placeholder="Assign Location"
                value={selectedLocation}
                onChange={this.handleLocationChange}
                options={locationOptions}
              />
            </ModalBody>
            <ModalFooter>
              <Row className={"m-0"} style={{ width: "100%" }}>
                <Col className={"p-0"} xl={12}>
                  <div style={{ width: "100%", textAlign: "end" }}>
                    <Button
                      style={{ paddingLeft: "10px", paddingRight: "10px" }}
                      className={"mr-2 btn-apply-filter"}
                      onClick={this.assignLocation}
                      size="lg"
                    >
                      Assign Location
                    </Button>
                    <Button
                      className={"close-filter-btn"}
                      onClick={this.props.toggleLocationModal}
                      size="lg"
                    >
                      Close
                    </Button>
                  </div>
                </Col>
              </Row>
            </ModalFooter>
          </BlockUi>
        </Modal>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { auth } = state;
  return { user: auth.user };
}

export default connect(mapStateToProps, auth.actions)(AssignLocationModal);
