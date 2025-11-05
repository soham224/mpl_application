import React, { Component } from "react";
import { Card, CardBody, Col, Collapse, Row } from "reactstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import Select from "react-select";
import {
  getAllNotificationOfDate,
  getAllNotificationOfDateAndType,
} from "../_redux/notification";
import { infoToast, warningToast } from "../../../../../utils/ToastMessage";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toogleAccordian = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  componentDidMount() {}

  checkObj = (obj) => {
    if (obj.split("#")[0].includes("-")) {
      return true;
    } else {
      return false;
    }
  };
  handleDateChange = (e) => {
    if (e) {
      let x = e.day;
      let calenderDate =
        e.year + "-" + e.month.number + "-" + x + " " + e.hour + ":" + e.minute;
      let date = new Date(calenderDate);
      let dateIsoObj = date.toISOString();
      this.setState(
        {
          date: dateIsoObj,
        },
        () => {
          getAllNotificationOfDate(this.state.date.split("T")[0])
            .then((response) => {
              if (response && response.isSuccess) {
                let arr = [];
                // eslint-disable-next-line
                response.data.map((key, obj) => {
                  let data = { value: obj, label: key };
                  arr.push(data);
                });
                this.setState({
                  blocking: false,
                  typeOptions: arr,
                });
                infoToast("Please Select ViolationNotification Type Also");
              } else {
                warningToast("Data Not found for this date");
                this.setState({
                  blocking: false,
                });
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
        }
      );
    } else {
      this.setState({
        date: "",
      });
    }
    this.setState({
      blocking: true,
      selectedType: null,
      typeOptions: [],
      isOpen: false,
    });
  };
  handleTypeChange = (e) => {
    this.setState({
      blocking: true,
      selectedType: e,
    });
    getAllNotificationOfDateAndType(this.state.date.split("T")[0], e.label)
      .then((response) => {
        if (response && response.isSuccess) {
          this.setState({
            blocking: false,
            notificationObj: response.data,
            isOpen: true,
          });
        } else {
          warningToast("Data Not found for this Type");
          this.setState({
            blocking: false,
          });
        }
      })
      .catch((err) => {
        warningToast("Something went wrong");
        this.setState({
          blocking: false,
        });
      });
  };

  render() {
    const { isOpen } = this.state;
    return (
      <div>
        <Row>
          <Col xl={2}>
            <p className={"mt-0"}>Select Date</p>
          </Col>
          <Col xl={4}>
            <div>
              <DatePicker
                style={{
                  border: "1px solid hsl(0,0%,80%)",
                  minHeight: "40px",
                }}
                placeholder="Select Date Range"
                className="teal filterDateWidth"
                format="MM/DD/YYYY"
                value={this.state.startDate}
                onChange={(date) => this.handleDateChange(date)}
                plugins={[<DatePanel markFocused />]}
              />
            </div>
          </Col>
        </Row>
        <Row className={"mt-4 mb-4"}>
          <Col xl={2}>
            <p className={"mt-0"}>Select Type</p>
          </Col>
          <Col xl={4}>
            <div>
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
                placeholder="Select Type"
                isSearchable={false}
                value={this.state.selectedType}
                onChange={(e) => {
                  this.handleTypeChange(e);
                }}
                options={this.state.typeOptions}
              />
            </div>
          </Col>
        </Row>
        <div>
          <Collapse isOpen={isOpen} className="pb-2">
            <Card>
              <CardBody>
                {isOpen &&
                  this.state.notificationObj.map((obj, key) => (
                    <div
                      className="d-flex align-items-center mb-6"
                      style={{
                        border: "1px solid #8080806b",
                        borderRadius: "5px",
                        padding: "5px",
                      }}
                    >
                      <div className="symbol symbol-40 symbol-light-primary mr-5">
                        <span className="symbol-label">
                          <SVG
                            src={toAbsoluteUrl(
                              "/media/svg/icons/Home/Library.svg"
                            )}
                            className="svg-icon-lg svg-icon-primary"
                          ></SVG>
                        </span>
                      </div>
                      <div
                        className="d-flex flex-column font-weight-bold"
                        style={{ width: "100%" }}
                      >
                        <p className="text-dark text-hover-primary mb-1 font-size-lg">
                          {obj.notification_message}
                        </p>
                      </div>
                    </div>
                  ))}
              </CardBody>
            </Card>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default Notification;
