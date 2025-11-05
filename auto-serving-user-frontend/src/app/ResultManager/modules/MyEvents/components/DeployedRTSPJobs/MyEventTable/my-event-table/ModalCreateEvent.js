import React, { useEffect, useState } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import clsx from "clsx";
import CardMedia from "@material-ui/core/CardMedia";
import Boundingbox from "image-bounding-box-custom";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import { connect } from "react-redux";
import * as auth from "../../../../../../../Admin/modules/Auth";
import { getUtcDateAndTimeFromCalendar } from "../../../../../../../../utils/TimeZone";
import { warningToast } from "../../../../../../../../utils/ToastMessage";
import { getEventModalType } from "../../../../_redux/MyEventApi";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import CreatableSelect from "react-select/creatable";

const useStyles = makeStyles({
  card: {
    maxWidth: 416,
    height: "100%",
    margin: "auto"
  },
  media: {
    height: 230
  },
  header: {
    paddingBottom: "0rem"
  },
  learnMore: {
    position: "absolute",
    bottom: 0
  },
  cardCol: {
    height: 320,
    marginTop: 25,
    marginBottom: 15
  }
});

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    zIndex: 99
  })
};

const ModalCreateEvent = ({
  isModalOpen,
  userId,
  onSave,
  onHide,
  selectedImages,
  isErrors,
  lastSelectedCheckbox
}) => {
  const classes = useStyles();
  const [addEmployee, setAddEmployee] = useState({
    event_name: "",
    event_description: ""
  });
  const [show, setShow] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [labelOptions, setLabelOptions] = useState([]);
  const [selectedLabelArray, setSelectedLabelArray] = useState([]);
  const [selectedImagesUpdate, setSelectedImagesUpdate] = useState(
    selectedImages
  );
  const [sortvalue, setSortValue] = useState("");
  const [dateValues, setDateValues] = useState(new Date().toISOString());
  const [sortCameraDate, setSortCameraDate] = useState("");
  const [typeValue, setTypeValue] = React.useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);

    getEventModalType(userId)
      .then(response => {
        if (response && response.isSuccess) {
          let labelOptions = response.data.map(x => x);
          const labels = [];
          labelOptions.map((x, index) => {
            x.split(",").map(y => {
              labels.push({ label: y, value: y });
              return null;
            });
            return null;
          });
          if (labelOptions?.length === 0) {
            setLabelOptions([]);
          } else {
            setLabelOptions(labels);
          }
        } else throw new Error();
      })
      .catch(err => {
        if (err.detail) {
          warningToast(err.detail);
        } else {
          warningToast("Something went wrong");
        }
      });
    dataSelected(selectedImagesUpdate);
  }, []);

  useEffect(() => {
    dataSelected(selectedImagesUpdate);
  }, [selectedImagesUpdate]);

  const selectedCardImage = (event, data) => {
    let selected = { ...selectedImagesUpdate };
    if (Object.keys(selectedImagesUpdate).includes(data._id.$oid)) {
      delete selected[data._id.$oid];
    }
    setSelectedImagesUpdate({ ...selected });
    if (Object.keys(selected).length === 0) {
      onHide(false, selectedImagesUpdate);
      lastSelectedCheckbox(selectedImagesUpdate);
    }
  };

  const dataSelected = selectedImagesUpdate => {
    let timeList = [];
    Object.values(selectedImagesUpdate).map(time =>
      timeList.push(time.created_date.$date)
    );
    timeList.sort((a, b) => a - b);
    let sortFirstCameraDate = timeList[0];

    setDateValues(
      moment(new Date(sortFirstCameraDate).toISOString()).format(
        "MM/DD/YYYY, h:mm:ss a"
      )
    );
  };

  const changeEmployeeData = e => {
    let value = e.target.value;
    let name = e.target.name;
    let formData = { ...addEmployee };
    formData[name] = value;
    setAddEmployee(formData);
  };

  const handleStartDateChange = e => {
    if (e) {
      setShow(true);
      let selected_day = e.day;
      let date_GMT =
        e.year +
        "-" +
        e.month.number +
        "-" +
        selected_day +
        " " +
        e.hour.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false
        }) +
        ":" +
        e.minute.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false
        }) +
        ":" +
        e.second.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false
        });
      setSortCameraDate(getUtcDateAndTimeFromCalendar(date_GMT));
    } else {
      dataSelected();
      // setSortCameraDate(getCurrentDayStartDateWithTimeInUtc());
    }
    setShow(true);
  };

  const handleChange = (
    newValue
    // actionMeta: ActionMeta<labelOptions>
  ) => {
    if (newValue) {
      setTypeValue(newValue.value);
    } else {
      setTypeValue("");
    }
  };

  return (
    <div>
      {isLoading ? <BlockUi tag="div" blocking={true} color="#147b82" /> : null}
      <Modal
        size="lg"
        aria-labelledby="example-modal-sizes-title-lg"
        show={isModalOpen}
        onHide={() => onHide(false, selectedImagesUpdate)}
        style={{ maxHeight: "-webkit-fill-available" }}
      >
        <Modal.Header closeButton>
          <h3 id="example-modal-sizes-title-lg">Create Event</h3>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="locationName" as={Row}>
              <Form.Label column sm={4}>
                Name
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="event_name"
                  placeholder="Name"
                  onChange={e => changeEmployeeData(e)}
                />
                <div style={{ color: "red" }}>{isErrors["event_name"]}</div>
              </Col>
            </Form.Group>

            <Form.Group controlId="locationName" as={Row}>
              <Form.Label column sm={4}>
                Description
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  name="event_description"
                  placeholder="Description"
                  onChange={e => changeEmployeeData(e)}
                />
                <div style={{ color: "red" }}>
                  {isErrors["event_description"]}
                </div>
              </Col>
            </Form.Group>

            <Form.Group controlId="locationName" as={Row}>
              <Form.Label column sm={4}>
                Type
              </Form.Label>
              <Col sm={8}>
                <span>
                  <CreatableSelect
                    isClearable
                    className={"customeColor"}
                    styles={customStyles}
                    placeholder={"Select Type"}
                    onChange={handleChange}
                    options={labelOptions}
                  />
                </span>

                <div style={{ color: "red" }}>{isErrors["event_type"]}</div>
              </Col>
            </Form.Group>
            <Form.Group controlId="locationName" as={Row}>
              <Form.Label column sm={4}>
                Date & Time
              </Form.Label>
              <Col sm={8}>
                <DatePicker
                  style={{
                    borderRadius: "5px",
                    minHeight: "39px",
                    width: "100%",
                    border: "1px solid hsl(0,0%,80%)"
                  }}
                  placeholder="Select Date & Time"
                  className="teal filterDateWidth"
                  format="MM/DD/YYYY, h:mm:ss a"
                  value={dateValues}
                  onChange={e => {
                    setDateValues(e);
                    handleStartDateChange(e);
                  }}
                  maxDate={new Date()}
                  plugins={[
                    <TimePicker position="bottom" />,
                    <DatePanel markFocused />
                  ]}
                />
              </Col>
            </Form.Group>
          </Form>
          {Object.keys(selectedImagesUpdate).length > 0 ? (
            <div
              className={
                Object.keys(selectedImagesUpdate).length > 3
                  ? "modal-image-scroll"
                  : ""
              }
            >
              <Row className="mb-2 mt-2">
                {Object.values(selectedImagesUpdate)?.map((data, dataIndex) => (
                  <Col
                    xl={4}
                    md={4}
                    sm={12}
                    lg={4}
                    className={classes.cardCol}
                    key={dataIndex}
                  >
                    <Card
                      className={clsx(classes.card)}
                      onClick={e => {
                        selectedCardImage(e, data);
                      }}
                    >
                      <div>
                        <input
                          type="checkbox"
                          id={data.camera_id}
                          checked={true}
                          className="checkbox checkbox-primary"
                          style={{
                            zIndex: "1",
                            left: "2.25rem",
                            top: "1.25rem",
                            position: "absolute",
                            opacity: 1
                          }}
                        />

                        <label>
                          <CardMedia
                            style={{ cursor: "pointer" }}
                            className={classes.media}
                            alt={"Image Here 1"}
                          >
                            <Boundingbox
                              className="row m-auto col-12 p-0 text-center"
                              image={data?.image_url}
                              boxes={data?.result?.detection?.map(d => {
                                if (d.label) {
                                  return {
                                    coord: [
                                      d.location[0],
                                      d.location[1],
                                      d.location[2] - d.location[0],
                                      d.location[3] - d.location[1]
                                    ],
                                    label: d.label
                                  };
                                } else {
                                  return null;
                                }
                              })}
                              options={{
                                colors: {
                                  normal: "red",
                                  selected: "red",
                                  unselected: "red"
                                },
                                style: {
                                  maxWidth: "100%",
                                  maxHeight: "100vh",
                                  margin: "auto",
                                  width: 520,
                                  color: "red",
                                  height: 230
                                }
                              }}
                            />
                          </CardMedia>

                          <CardContent style={{ minHeight: "100px" }}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="h2"
                            >
                              Time:-{" "}
                              {moment(
                                new Date(data.created_date.$date).toISOString()
                              ).format("MMMM DD YYYY, h:mm:ss a")}
                              <br />
                            </Typography>
                          </CardContent>
                        </label>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <h3 align="center">No Data Found</h3>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            onClick={() => onHide(false, selectedImagesUpdate)}
            className="btn btn-light btn-elevate"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() =>
              onSave(
                selectedImagesUpdate,
                selectedLabelArray,
                addEmployee,
                sortvalue,
                dateValues,
                typeValue
              )
            }
            className="btn btn-primary btn-elevate ml-2"
          >
            save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

function mapStateToProps(state) {
  const { auth } = state;
  return { user: auth.user };
}

export default connect(mapStateToProps, auth.actions)(ModalCreateEvent);
