import React, { Component, Fragment } from "react";
import {
  Col,
  Label,
  Row,
  Input
} from "reactstrap";

import { addSupervisor } from "../AddSupervisor/_redux";
import { successToast, warningToast } from "../../../../utils/ToastMessage";
import { connect } from "react-redux";
import * as auth from "../Auth";
import { addNotification } from "../Notification/_redux/notification";
import {Button ,Modal} from "react-bootstrap";

class AddSupervisorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: props.modalOpen
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      modalOpen: nextProps.modalOpen
    });
  }

  addSupervisorToList = () => {
    const { user } = this.props;

    let param = {
      user_email: this.state.user_email,
      user_status: true,
      user_password: this.state.user_password
    };

    if (
      this.state.user_email &&
      this.state.user_email.trim() !== "" &&
      this.state.user_password &&
      this.state.user_password.trim() !== ""
    ) {
      // eslint-disable-next-line
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.user_email)) {
        addSupervisor(param)
          .then(response => {
            if (response && response.isSuccess) {
              this.props.toggleSupervisorModal();

              let data1 = {
                notification_message:
                  "Supervisor Added : " + this.state.user_email,
                user_id: user.id,
                type_of_notification: "string",
                status: true,
                is_unread: true
              };
              addNotification(data1)
                .then(response => {
                  if (response && response.isSuccess) {
                    successToast("Supervisor Added Successfully");
                  }
                })
                .catch(error => {
                  if (error.detail) {
                    warningToast(error.detail);
                  }
                });
            }
          })
          .catch(error => {
            if (error.detail) {
              warningToast(error.detail);
            } else {
              warningToast("Something went wrong");
            }
          });
      } else {
        warningToast("Please add valid email");
      }
    } else {
      warningToast("Please fill required fields");
    }
  };

  handleOnChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <Fragment>
        <Modal
          backdrop="static"
          size="lg"
          show={this.state.modalOpen}
          onHide={this.props.toggleSupervisorModal}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Add Supervisor
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Label for="email">Email *</Label>
            <Input
              onChange={this.handleOnChange}
              type="email"
              name="user_email"
            />
            <Label for="password">Password *</Label>
            <Input
              onChange={this.handleOnChange}
              type="password"
              name="user_password"
            />
          </Modal.Body>
          <Modal.Footer>
            <Row className={"m-0"} style={{ width: "100%" }}>
              <Col className={"p-0"} xl={12}>
                <div style={{ width: "100%", textAlign: "end" }}>
                  <Button
                   variant="primary"
                   className={'mr-2'}
                    onClick={this.addSupervisorToList}
                  >
                    Add Supervisor
                  </Button>
                  <Button
                   variant="secondary"
                    onClick={this.props.toggleSupervisorModal}
                  >
                    Close
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

export default connect(mapStateToProps, auth.actions)(AddSupervisorModal);
